describe('Dashboard', () => {
  beforeEach(() => {
    cy.setupMocks();
    cy.visitAuthenticated('/');
  });

  it('exibe título Dashboard', () => {
    cy.contains('Dashboard').should('be.visible');
  });

  it('exibe card Minhas Favoritas', () => {
    cy.contains('Minhas Favoritas').should('be.visible');
  });

  it('exibe card Top Picks ML', () => {
    cy.contains(/Top Picks ML/).should('be.visible');
  });

  it('exibe card Meu Portfólio quando há investimentos', () => {
    cy.contains('Meu Portfólio').should('be.visible');
  });

  it('exibe PETR4 no card de favoritas', () => {
    cy.contains('PETR4').should('be.visible');
  });

  it('link da favorita navega para detalhe da ação', () => {
    cy.contains('a', 'PETR4').click();
    cy.url().should('include', '/acao/PETR4');
  });
});
