describe('Detalhe da Ação', () => {
  beforeEach(() => {
    cy.setupMocks();
    cy.visitAuthenticated('/acao/PETR4');
  });

  it('exibe ticker como título principal', () => {
    cy.get('h4').contains('PETR4').should('be.visible');
  });

  it('exibe nome da empresa', () => {
    cy.contains('Petrobras').should('be.visible');
  });

  it('exibe chip com label ML', () => {
    cy.contains('BARATA').should('be.visible');
  });

  it('exibe seção de indicadores Valuation', () => {
    cy.contains('Valuation').should('be.visible');
  });

  it('exibe preço da ação em BRL', () => {
    cy.contains(/R\$.*38/).should('be.visible');
  });

  it('botão Voltar navega para /listaAcoes', () => {
    cy.contains(/voltar/i).click();
    cy.url().should('include', '/listaAcoes');
  });
});
