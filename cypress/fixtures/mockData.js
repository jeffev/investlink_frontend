const FAKE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiIxIiwicHJvZmlsZSI6IlVTRVIiLCJleHAiOjk5OTk5OTk5OTl9' +
  '.fake';

const MOCK_USER = {
  profile: 'USER',
  name: 'Test User',
  user_name: 'testuser',
  access_token: FAKE_TOKEN,
};

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
  { id: 1, ceiling_price: 45.0, target_price: 50.0, stock: MOCK_STOCKS[0] },
];

const MOCK_FIIS = [
  {
    ticker: 'HGLG11',
    price: 158.5,
    dy: 9.2,
    p_vp: 0.95,
    favorita: false,
    fund_name: 'CSHG Logística',
    segment: 'Logística',
  },
  {
    ticker: 'XPML11',
    price: 102.3,
    dy: 10.1,
    p_vp: 0.88,
    favorita: false,
    fund_name: 'XP Malls',
    segment: 'Shopping',
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

module.exports = {
  FAKE_TOKEN,
  MOCK_USER,
  MOCK_STOCKS,
  MOCK_FAVORITES,
  MOCK_FIIS,
  MOCK_PREDICTIONS,
  MOCK_PORTFOLIO_SUMMARY,
  MOCK_PORTFOLIO,
};
