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

// Formato real da API: lista paginada, não array puro. Enquanto este mock
// devolvia array, o E2E passava enquanto `/home`, `/acao/:ticker` e
// `/fii/:ticker` quebravam em produção com ".find is not a function".
const MOCK_FAVORITES = {
  data: [{ id: 1, ceiling_price: 45.0, target_price: 50.0, stock: MOCK_STOCKS[0] }],
  pagination: { page: 1, pages: 1, per_page: 50, total: 1 },
};

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

const MOCK_SCORE_PROFILES = {
  data: [
    { key: 'EQUILIBRADO', label: 'Equilibrado', weights: {}, default: true },
    { key: 'DIVIDENDOS', label: 'Dividendos', weights: {}, default: false },
  ],
};

const MOCK_OPPORTUNITIES = {
  profile: 'EQUILIBRADO',
  data: [
    {
      ticker: 'POMO4',
      companyname: 'Marcopolo',
      sectorname: 'Bens Industriais',
      price: 4.6,
      fundamentals_source: 'CVM',
      fundamentals_date: '2026-06-30',
      score: {
        score_total: 64.9,
        pillars: [
          { key: 'valuation', label: 'Valuation', value: 46 },
          { key: 'qualidade', label: 'Qualidade', value: 66 },
        ],
        reasons: [
          {
            code: 'PILAR_DIVIDENDOS',
            message: 'Dividendos acima da média do setor (95/100)',
          },
        ],
        red_flags: [
          { code: 'DY_IMPLAUSIVEL', message: 'DY de 22,3% dificilmente se repete' },
        ],
        eligible: true,
        exclusion_reasons: [],
      },
    },
  ],
};

const MOCK_FII_PROFILES = {
  data: [
    { key: 'EQUILIBRADO', label: 'Equilibrado', weights: {}, default: true },
    { key: 'RENDA', label: 'Renda', weights: {}, default: false },
    { key: 'VALOR', label: 'Valor', weights: {}, default: false },
  ],
};

const MOCK_FII_OPPORTUNITIES = {
  profile: 'EQUILIBRADO',
  data: [
    {
      ticker: 'HGLG11',
      companyname: 'CSHG Logística',
      segment: 'Logística',
      price: 147.6,
      p_vp: 0.89,
      dy: 8.97,
      vacancia_media: 2.41,
      qtd_imoveis: 37,
      score: {
        score_total: 84.2,
        pillars: [
          { key: 'valuation', label: 'Valuation', value: 72 },
          { key: 'renda', label: 'Renda', value: 81 },
        ],
        reasons: [
          {
            code: 'P_VP_DESCONTO',
            message: 'Cota a 0,89× o valor patrimonial — desconto de 11%',
          },
        ],
        red_flags: [
          {
            code: 'IMOVEL_UNICO',
            message: 'Fundo de um imóvel só — a saída de um inquilino zera a receita',
          },
        ],
        eligible: true,
        exclusion_reasons: [],
      },
    },
  ],
};

const MOCK_SCORE_BACKTEST = {
  profile: 'EQUILIBRADO',
  summary: {
    years: 2,
    top_decile_total: 24.6,
    universe_total: 0.0,
    top_decile_annualised: 11.6,
    universe_annualised: 0.0,
    beat_universe_in: 2,
  },
  years: [
    {
      year: 2021,
      holding_period: '2021-12-31 → 2022-12-31',
      universe_size: 180,
      selected: 18,
      top_decile_return: 31.2,
      universe_return: 10.0,
      excess_return: 21.2,
      tickers: ['POMO4'],
    },
  ],
  caveats: [
    {
      code: 'VIES_SOBREVIVENCIA',
      message: 'O universo só contém empresas que existem hoje.',
    },
    {
      code: 'COMPARADOR_NAO_E_IBOV',
      message: 'O comparador não é o Ibovespa.',
    },
  ],
};

const MOCK_HISTORICAL_CONTEXT = {
  ticker: 'PETR4',
  years_requested: 5,
  years_available: 5,
  indicators: [
    {
      key: 'p_l',
      label: 'P/L',
      lower_is_better: true,
      current: 8.2,
      median: 12.6,
      min: 6.1,
      max: 18.0,
      deviation_percent: -34.92,
      percentile: 20,
      verdict: 'BARATO',
      years: [2021, 2022, 2023, 2024, 2025],
    },
  ],
};

// Espelha o formato real de news_service.py: `articles`, não `data`, e os
// campos em camelCase que vêm da NewsAPI.
const MOCK_NEWS = {
  articles: [
    {
      title: 'Petrobras aprova novo plano de investimentos',
      description: 'A companhia anunciou o plano quinquenal.',
      url: 'https://exemplo.invalido/noticia',
      urlToImage: null,
      publishedAt: '2026-09-17T12:00:00Z',
      source: 'Reuters',
    },
  ],
  total_results: 1,
  page: 1,
  per_page: 20,
};

module.exports = {
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
};
