describe('Lista de Ações', () => {
  beforeEach(() => {
    cy.setupMocks();
    cy.visitAuthenticated('/listaAcoes');
  });

  it('exibe PETR4 e VALE3 na tabela', () => {
    cy.contains('PETR4').should('be.visible');
    cy.contains('VALE3').should('be.visible');
  });

  it('exibe campo de busca', () => {
    cy.get('input[placeholder*="Buscar por ticker"]').should('be.visible');
  });

  it('exibe chips de filtro', () => {
    cy.contains('BARATA').should('be.visible');
    cy.contains('DY > 8%').should('be.visible');
    cy.contains('Top Magic Formula').should('be.visible');
  });

  it('chip BARATA filtra a tabela', () => {
    cy.intercept('GET', '**/v1/stocks**', {
      statusCode: 200,
      body: {
        data: [
          { ticker: 'PETR4', price: 38.5, ml_label: 'BARATA', dy: 12.5, p_l: 4.2,
            favorita: false, companyname: 'Petrobras', sectorname: 'Petróleo',
            roic: 18.5, magic_formula_rank: 3 },
        ],
        pagination: { total: 1, page: 1, per_page: 15 },
      },
    });

    cy.contains('BARATA').click();
    cy.contains('VALE3').should('not.exist');
    cy.contains('PETR4').should('be.visible');
  });

  it('busca por ticker filtra a lista', () => {
    cy.intercept('GET', '**/v1/stocks**', {
      statusCode: 200,
      body: {
        data: [
          { ticker: 'PETR4', price: 38.5, ml_label: 'BARATA', dy: 12.5, p_l: 4.2,
            favorita: false, companyname: 'Petrobras', sectorname: 'Petróleo',
            roic: 18.5, magic_formula_rank: 3 },
        ],
        pagination: { total: 1, page: 1, per_page: 15 },
      },
    });

    cy.get('input[placeholder*="Buscar por ticker"]').type('PETR4');
    cy.contains('VALE3').should('not.exist');
    cy.contains('PETR4').should('be.visible');
  });

  it('adicionar favorita exibe confirmação de sucesso', () => {
    cy.get('button.MuiIconButton-colorSecondary').first().click();
    cy.contains(/removida\/adicionada com sucesso/i).should('be.visible');
  });

  it('navega para detalhe da ação', () => {
    cy.get('button.MuiIconButton-colorSecondary').first().prev('button').click();
    cy.url().should('include', '/acao/');
  });
});
