describe('Lista de FIIs', () => {
  beforeEach(() => {
    cy.setupMocks();
    cy.visitAuthenticated('/listaFiis');
  });

  it('exibe HGLG11 e XPML11 na tabela', () => {
    cy.contains('HGLG11').should('be.visible');
    cy.contains('XPML11').should('be.visible');
  });

  it('exibe campo de busca', () => {
    cy.get('input[placeholder*="Buscar"]').should('be.visible');
  });

  it('exibe chip de filtro DY', () => {
    cy.contains(/DY/i).should('be.visible');
  });

  it('navega para detalhe do FII', () => {
    cy.contains('HGLG11').first().click();
    cy.url().should('include', '/fii/');
  });
});
