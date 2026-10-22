describe('Portfolio', () => {
  beforeEach(() => {
    cy.setupMocks();
    cy.visitAuthenticated('/portfolio');
  });

  it('exibe título Minha Carteira', () => {
    cy.contains('Minha Carteira').should('be.visible');
  });

  it('exibe resumo com Total Investido', () => {
    cy.contains('Total Investido').should('be.visible');
  });

  it('separa ações e FIIs em abas', () => {
    // A aba de FIIs entrou no Sprint D1 e este spec ficou quatro meses
    // testando um rótulo que a página já não tinha.
    cy.contains('.MuiTab-root', /Ações \(/).should('be.visible');
    cy.contains('.MuiTab-root', /FIIs \(/).should('be.visible');
  });

  it('exibe posição PETR4 na tabela', () => {
    cy.contains('PETR4').should('be.visible');
  });

  it('abre o modal de nova posição em ação', () => {
    cy.contains('button', 'Adicionar ação').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]').contains('Adicionar ação').should('be.visible');
  });

  it('preenche e submete o modal de nova posição', () => {
    cy.contains('button', 'Adicionar ação').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[name="ticker"]').type('VALE3');
      cy.get('input[name="quantity"]').type('50');
      cy.get('input[name="average_price"]').type('60');
      cy.contains('button', 'Adicionar').click();
    });

    cy.wait('@addPosition');
    cy.contains(/Posição adicionada com sucesso/i).should('be.visible');
  });

  it('o botão Adicionar fica desabilitado com campos vazios', () => {
    cy.contains('button', 'Adicionar ação').click();
    cy.get('[role="dialog"]').contains('button', 'Adicionar').should('be.disabled');
  });

  it('remove posição e confirma', () => {
    cy.contains('PETR4').should('be.visible');
    cy.get('button.MuiIconButton-colorError').first().click();
    cy.wait('@removePosition');
    cy.contains(/Posição removida com sucesso/i).should('be.visible');
  });
});
