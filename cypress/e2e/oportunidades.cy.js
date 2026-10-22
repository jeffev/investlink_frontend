describe('Oportunidades', () => {
  beforeEach(() => {
    cy.setupMocks();
    cy.visitAuthenticated('/oportunidades');
  });

  it('exibe o título e o aviso de que não é recomendação', () => {
    cy.contains('h1', 'Oportunidades').should('be.visible');
    cy.contains(/não é\s+recomendação de compra/).should('be.visible');
  });

  it('monta o card com o ativo ranqueado', () => {
    cy.wait('@getOpportunities');
    cy.contains('POMO4').should('be.visible');
    cy.contains('Marcopolo').should('be.visible');
  });

  it('mostra o argumento a favor e o alerta contra, lado a lado', () => {
    // É o que separa esta tela de um screener comum: uma lista que só
    // argumenta a favor do ativo é propaganda.
    cy.contains(/por que está aqui/i).should('be.visible');
    cy.contains('Dividendos acima da média do setor (95/100)').should('be.visible');
    cy.contains(/o que pode dar errado/i).should('be.visible');
    cy.contains('DY de 22,3% dificilmente se repete').should('be.visible');
  });

  it('declara a procedência do fundamento no card', () => {
    cy.contains('CVM · 12m').should('be.visible');
  });

  it('abre a decomposição do score ao clicar no chip', () => {
    // Score sem explicação é número que ninguém confia.
    cy.get('[aria-label="Ver composição do score"]').first().click();
    cy.contains('Composição').should('be.visible');
    cy.contains('Valuation').should('be.visible');
  });

  it('busca uma vez só no carregamento, já com o perfil resolvido', () => {
    // A página esperava o perfil chegar e pedia a vitrine duas vezes.
    cy.wait('@getOpportunities').its('request.url').should('include', 'profile=');
    cy.get('@getOpportunities.all').should('have.length', 1);
  });

  it('troca de perfil e refaz a busca', () => {
    cy.wait('@getOpportunities');
    cy.contains('button', 'Dividendos').click();
    cy.wait('@getOpportunities').its('request.url').should('include', 'profile=DIVIDENDOS');
  });

  it('leva ao detalhe da ação', () => {
    cy.contains('a', 'POMO4').click();
    cy.url().should('include', '/acao/POMO4');
  });

  describe('backtest do score', () => {
    it('começa recolhido — não é o assunto principal da página', () => {
      cy.contains('2021-12-31').should('not.be.visible');
    });

    it('mostra as ressalvas ANTES dos números', () => {
      // Backtest lido sem as próprias limitações vira promessa de retorno.
      cy.contains('Como este score se saiu no passado').click();
      cy.contains('Leia antes de olhar os números').should('be.visible');
      cy.contains('O universo só contém empresas que existem hoje.').should('be.visible');
      cy.contains('O comparador não é o Ibovespa.').should('be.visible');
    });

    it('lista o resultado por período', () => {
      cy.contains('Como este score se saiu no passado').click();
      cy.contains('2021-12-31 → 2022-12-31').should('be.visible');
      cy.contains('Bateu em 2 de 2 anos').should('be.visible');
    });
  });

  describe('vitrine de FII', () => {
    beforeEach(() => {
      cy.wait('@getOpportunities');
      cy.contains('.MuiTab-root', 'FIIs').click();
      cy.wait('@getFiiOpportunities');
    });

    it('abre em Ações — a vitrine de FII é a segunda aba, não a primeira', () => {
      // Verificado antes do clique do beforeEach pelo próprio @getOpportunities:
      // a primeira busca da página é a de ações.
      cy.get('@getOpportunities.all').should('have.length', 1);
    });

    it('monta o card do fundo', () => {
      cy.contains('HGLG11').should('be.visible');
      cy.contains('CSHG Logística').should('be.visible');
    });

    it('mostra os números que decidem a compra de um fundo', () => {
      // P/VP e DY são o equivalente do P/L e do ROE no card de ação; vacância
      // é o que explica o rendimento cair no mês seguinte.
      cy.contains('0,89').should('be.visible');
      cy.contains('8,97%').should('be.visible');
      cy.contains('2,41%').should('be.visible');
    });

    it('não mostra indicador de ação que não existe em fundo', () => {
      cy.contains('CVM · 12m').should('not.exist');
    });

    it('leva ao detalhe do fundo, não ao de ação', () => {
      cy.contains('a', 'HGLG11').click();
      cy.url().should('include', '/fii/HGLG11');
    });

    it('troca os perfis pelos do fundo', () => {
      // CRESCIMENTO não existe para FII; RENDA não existe para ação. Manter a
      // aba errada faria a próxima busca voltar 400.
      cy.contains('button', 'Renda').should('be.visible');
      cy.contains('button', 'Dividendos').should('not.exist');
    });

    it('esconde o backtest, que só existe para ações', () => {
      // O histórico anual de FII ainda não foi construído; mostrar o card com
      // os números da ação seria atribuir ao fundo um desempenho que não é dele.
      cy.contains('Como este score se saiu no passado').should('not.exist');
    });
  });

  describe('quando não há o que mostrar', () => {
    it('explica pelos filtros, não por falta de dado', () => {
      cy.intercept('GET', '**/v1/opportunities?**', {
        statusCode: 200,
        body: { profile: 'EQUILIBRADO', data: [] },
      }).as('getVazio');
      cy.visitAuthenticated('/oportunidades');

      cy.contains(/Nenhuma ação passou pelos filtros/).should('be.visible');
    });

    it('avisa quando a busca falha', () => {
      cy.intercept('GET', '**/v1/opportunities?**', { statusCode: 500, body: {} }).as(
        'getErro'
      );
      cy.visitAuthenticated('/oportunidades');

      cy.contains('Não foi possível carregar as oportunidades.').should('be.visible');
    });
  });
});
