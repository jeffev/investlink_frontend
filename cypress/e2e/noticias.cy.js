describe('Notícias do Mercado', () => {
  beforeEach(() => {
    cy.setupMocks();
  });

  it('exibe o título da página', () => {
    cy.visitAuthenticated('/noticias');
    cy.contains('Notícias do Mercado').should('be.visible');
  });

  it('lista a manchete vinda da API', () => {
    cy.visitAuthenticated('/noticias');
    cy.wait('@getNews');

    cy.contains('Petrobras aprova novo plano de investimentos').should('be.visible');
    cy.contains('Reuters').should('be.visible');
  });

  it('explica a lista vazia em vez de mostrar nada', () => {
    cy.intercept('GET', '**/v1/news**', {
      statusCode: 200,
      body: { articles: [], total_results: 0, page: 1, per_page: 20 },
    }).as('getNewsVazio');

    cy.visitAuthenticated('/noticias');
    cy.wait('@getNewsVazio');

    cy.contains('Notícias do Mercado').should('be.visible');
    cy.contains('Petrobras aprova').should('not.exist');
  });

  it('não quebra quando a fonte de notícias está fora do ar', () => {
    // A NewsAPI exige chave e tem cota diária: indisponível é o caso comum,
    // não a exceção.
    cy.intercept('GET', '**/v1/news**', { statusCode: 500, body: {} }).as('getNewsErro');

    cy.visitAuthenticated('/noticias');
    cy.wait('@getNewsErro');

    cy.contains('Notícias do Mercado').should('be.visible');
  });
});
