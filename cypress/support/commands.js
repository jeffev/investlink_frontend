const {
  FAKE_TOKEN,
  MOCK_USER,
  MOCK_STOCKS,
  MOCK_FAVORITES,
  MOCK_FIIS,
  MOCK_PREDICTIONS,
  MOCK_PORTFOLIO_SUMMARY,
  MOCK_PORTFOLIO,
  MOCK_SCORE_PROFILES,
  MOCK_OPPORTUNITIES,
  MOCK_FII_PROFILES,
  MOCK_FII_OPPORTUNITIES,
  MOCK_SCORE_BACKTEST,
  MOCK_HISTORICAL_CONTEXT,
  MOCK_NEWS,
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

  // Portfolio — os caminhos específicos vão DEPOIS do wildcard acima, senão
  // '**/v1/portfolio**' devolve a lista de posições para /summary e /fii.
  cy.intercept('GET', '**/v1/portfolio/summary', {
    statusCode: 200,
    body: MOCK_PORTFOLIO_SUMMARY,
  }).as('getPortfolioSummaryOk');

  cy.intercept('GET', '**/v1/portfolio/fii**', {
    statusCode: 200,
    body: { data: [], pagination: { total: 0, current_page: 1, per_page: 200, pages: 0 } },
  }).as('getPortfolioFii');

  // User layout
  cy.intercept('**/v1/user_layout/**', { statusCode: 200, body: {} }).as('userLayout');

  // Score e oportunidades.
  //
  // Registrados DEPOIS do wildcard '**/v1/stock/**' de propósito: no Cypress o
  // último intercept ganha em caso de sobreposição, e sem isto o
  // /stock/PETR4/historical-context voltaria com o corpo de uma ação.
  // O '**' no fim é obrigatório desde que a chamada leva ?asset_type=: sem ele
  // o glob compara o segmento inteiro e 'profiles?asset_type=ACAO' não bate.
  cy.intercept('GET', '**/v1/opportunities/profiles**', {
    statusCode: 200,
    body: MOCK_SCORE_PROFILES,
  }).as('getScoreProfiles');

  cy.intercept('GET', '**/v1/opportunities/backtest**', {
    statusCode: 200,
    body: MOCK_SCORE_BACKTEST,
  }).as('getScoreBacktest');

  cy.intercept('GET', '**/v1/opportunities**', {
    statusCode: 200,
    body: MOCK_OPPORTUNITIES,
  }).as('getOpportunities');

  // Depois dos genéricos, de novo porque o último registro ganha: a vitrine de
  // FII é a mesma rota, distinguida só pelo asset_type.
  cy.intercept(
    { method: 'GET', pathname: '/v1/opportunities/profiles', query: { asset_type: 'FII' } },
    { statusCode: 200, body: MOCK_FII_PROFILES }
  ).as('getFiiProfiles');

  cy.intercept(
    { method: 'GET', pathname: '/v1/opportunities', query: { asset_type: 'FII' } },
    { statusCode: 200, body: MOCK_FII_OPPORTUNITIES }
  ).as('getFiiOpportunities');

  cy.intercept('GET', '**/v1/stock/*/historical-context**', {
    statusCode: 200,
    body: MOCK_HISTORICAL_CONTEXT,
  }).as('getHistoricalContext');

  cy.intercept('GET', '**/v1/stock/*/score**', {
    statusCode: 200,
    body: { ticker: 'PETR4', score_total: 70.0, pillars: [], reasons: [], red_flags: [] },
  }).as('getStockScore');

  cy.intercept('GET', '**/v1/stock/*/history**', {
    statusCode: 200,
    body: { ticker: 'PETR4', data: [] },
  }).as('getPriceHistory');

  cy.intercept('GET', '**/v1/stocks/bulk**', {
    statusCode: 200,
    body: MOCK_STOCKS,
  }).as('getBulkStocks');

  cy.intercept('GET', '**/v1/news**', { statusCode: 200, body: MOCK_NEWS }).as('getNews');

  cy.intercept('GET', '**/v1/benchmarks', { statusCode: 200, body: {} }).as('getBenchmarks');

  cy.intercept('GET', '**/v1/portfolio/projected-income', {
    statusCode: 200,
    body: { monthly: 0 },
  }).as('getProjectedIncome');
});

module.exports = { FAKE_TOKEN, MOCK_USER, MOCK_STOCKS, MOCK_FAVORITES, MOCK_FIIS, MOCK_PORTFOLIO };
