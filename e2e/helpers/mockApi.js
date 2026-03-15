const MOCK_STOCKS = [
  {
    ticker: 'PETR4',
    price: 38.5,
    ml_label: 'BARATA',
    dy: 12.5,
    p_l: 4.2,
    favorita: false,
    companyname: 'Petrobras',
    sectorname: 'Petróleo',
    roic: 18.5,
    magic_formula_rank: 3,
  },
  {
    ticker: 'VALE3',
    price: 62.1,
    ml_label: 'NEUTRA',
    dy: 8.1,
    p_l: 5.8,
    favorita: false,
    companyname: 'Vale',
    sectorname: 'Mineração',
    roic: 22.1,
    magic_formula_rank: 7,
  },
];

const MOCK_FAVORITES = [
  {
    id: 1,
    ceiling_price: 45.0,
    target_price: 50.0,
    stock: MOCK_STOCKS[0],
  },
];

const MOCK_PREDICTIONS = [
  { ticker: 'WEGE3', label: 'BARATA', prob_barata: 0.85, composite_score: 90 },
  { ticker: 'PETR4', label: 'BARATA', prob_barata: 0.75, composite_score: 80 },
];

const MOCK_PORTFOLIO_SUMMARY = {
  total_invested: 3500,
  current_value: 3850,
  total_pnl: 350,
  total_pnl_percent: 10,
};

const MOCK_PORTFOLIO = [
  {
    id: 1,
    ticker: 'PETR4',
    quantity: 100,
    average_price: 35.0,
    total_invested: 3500,
    current_price: 38.5,
    current_value: 3850,
    pnl: 350,
    pnl_percent: 10,
  },
];

async function setupMockApi(page) {
  // Stocks list
  await page.route('**/v1/stocks**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: MOCK_STOCKS,
        pagination: { total: 2, page: 1, per_page: 15 },
      }),
    });
  });

  // Individual stock
  await page.route('**/v1/stock/**', async (route) => {
    const url = route.request().url();
    const ticker = url.split('/stock/')[1];
    const stock = MOCK_STOCKS.find((s) => s.ticker === ticker) || MOCK_STOCKS[0];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(stock),
    });
  });

  // Favorites
  await page.route('**/v1/favorites', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_FAVORITES),
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });

  await page.route('**/v1/favorites/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  // Alerts
  await page.route('**/v1/favorites/alerts', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  // Predictions
  await page.route('**/v1/stocks/predictions', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: MOCK_PREDICTIONS }),
    });
  });

  // Portfolio summary
  await page.route('**/v1/portfolio/summary', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_PORTFOLIO_SUMMARY),
    });
  });

  // Portfolio CRUD
  await page.route('**/v1/portfolio', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PORTFOLIO),
      });
    } else if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ...MOCK_PORTFOLIO[0], id: 2 }),
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });

  await page.route('**/v1/portfolio/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  // User layout
  await page.route('**/v1/layout/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}

module.exports = { setupMockApi, MOCK_STOCKS, MOCK_FAVORITES, MOCK_PREDICTIONS, MOCK_PORTFOLIO };
