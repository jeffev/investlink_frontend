const {
  FAKE_TOKEN,
  MOCK_USER,
  MOCK_STOCKS,
  MOCK_FAVORITES,
  MOCK_FIIS,
  MOCK_PREDICTIONS,
  MOCK_PORTFOLIO_SUMMARY,
  MOCK_PORTFOLIO,
} = require('../fixtures/mockData');

// Visita uma rota autenticada injetando o usuário no sessionStorage
Cypress.Commands.add('visitAuthenticated', (path) => {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.sessionStorage.setItem('user', JSON.stringify(MOCK_USER));
      win.sessionStorage.setItem('refresh_token', 'fake_refresh_token');
    },
  });
});

// Intercepta todas as rotas de API com dados mockados
Cypress.Commands.add('setupMocks', () => {
  // Stocks
  cy.intercept('GET', '**/v1/stocks**', {
    statusCode: 200,
    body: { data: MOCK_STOCKS, pagination: { total: 2, page: 1, per_page: 15 } },
  }).as('getStocks');

  cy.intercept('GET', '**/v1/stock/**', (req) => {
    const ticker = req.url.split('/stock/')[1].split('?')[0];
    const stock = MOCK_STOCKS.find((s) => s.ticker === ticker) || MOCK_STOCKS[0];
    req.reply({ statusCode: 200, body: stock });
  }).as('getStock');

  // Favorites — alerts antes do wildcard para evitar captura errada
  cy.intercept('GET', '**/v1/favorites/alerts', {
    statusCode: 200,
    body: [],
  }).as('getAlerts');

  cy.intercept('GET', '**/v1/favorites/fii**', {
    statusCode: 200,
    body: [],
  }).as('getFavFiis');

  cy.intercept('GET', '**/v1/favorites**', {
    statusCode: 200,
    body: MOCK_FAVORITES,
  }).as('getFavorites');

  cy.intercept({ method: 'POST', url: '**/v1/favorites/**' }, { statusCode: 200, body: {} }).as('addFav');
  cy.intercept({ method: 'DELETE', url: '**/v1/favorites/**' }, { statusCode: 200, body: {} }).as('removeFav');
  cy.intercept({ method: 'PUT', url: '**/v1/favorite/**' }, { statusCode: 200, body: {} }).as('editFav');

  // FIIs
  cy.intercept('GET', '**/v1/fiis**', {
    statusCode: 200,
    body: { data: MOCK_FIIS, pagination: { total: 2, page: 1, per_page: 15 } },
  }).as('getFiis');

  cy.intercept('GET', '**/v1/fii/**', {
    statusCode: 200,
    body: MOCK_FIIS[0],
  }).as('getFii');

  // Predictions
  cy.intercept('GET', '**/v1/stocks/predictions', {
    statusCode: 200,
    body: { data: MOCK_PREDICTIONS },
  }).as('getPredictions');

  // Portfolio
  cy.intercept('GET', '**/v1/portfolio/summary', {
    statusCode: 200,
    body: MOCK_PORTFOLIO_SUMMARY,
  }).as('getPortfolioSummary');

  cy.intercept('GET', '**/v1/portfolio**', {
    statusCode: 200,
    body: MOCK_PORTFOLIO,
  }).as('getPortfolio');

  cy.intercept('POST', '**/v1/portfolio', {
    statusCode: 201,
    body: { ...MOCK_PORTFOLIO[0], id: 2, ticker: 'VALE3' },
  }).as('addPosition');

  cy.intercept({ method: 'DELETE', url: '**/v1/portfolio/**' }, { statusCode: 200, body: {} }).as('removePosition');
  cy.intercept({ method: 'PUT', url: '**/v1/portfolio/**' }, { statusCode: 200, body: {} }).as('editPosition');

  // User layout
  cy.intercept('**/v1/user_layout/**', { statusCode: 200, body: {} }).as('userLayout');
});

module.exports = { FAKE_TOKEN, MOCK_USER, MOCK_STOCKS, MOCK_FAVORITES, MOCK_FIIS, MOCK_PORTFOLIO };
