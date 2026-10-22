jest.mock('./api.service', () => class ApiService {
  async request() {}
});

import portfolioService from './portfolio.service';

describe('portfolio.service', () => {
  beforeEach(() => {
    jest.spyOn(portfolioService, 'request').mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPortfolio', () => {
    it('pede a primeira pagina e devolve a lista sem o envelope', async () => {
      portfolioService.request.mockResolvedValue({
        data: [{ ticker: 'PETR4' }],
        pagination: { total: 1 },
      });

      const posicoes = await portfolioService.getPortfolio();

      expect(portfolioService.request).toHaveBeenCalledWith(
        'get',
        'portfolio?page=1&per_page=200'
      );
      // A pagina consome um array; desembrulhar aqui evita que cada tela
      // precise conhecer o formato da paginacao.
      expect(posicoes).toEqual([{ ticker: 'PETR4' }]);
    });

    it('tolera uma resposta que ainda venha como array', async () => {
      portfolioService.request.mockResolvedValue([{ ticker: 'VALE3' }]);
      expect(await portfolioService.getPortfolio()).toEqual([
        { ticker: 'VALE3' },
      ]);
    });
  });

  describe('getPortfolioSummary', () => {
    it('chama request com get e portfolio/summary', async () => {
      await portfolioService.getPortfolioSummary();
      expect(portfolioService.request).toHaveBeenCalledWith('get', 'portfolio/summary');
    });
  });

  describe('addPosition', () => {
    it('chama request com post, portfolio e os dados da posição', async () => {
      const data = { ticker: 'PETR4', quantity: 10, average_price: 25 };
      await portfolioService.addPosition(data);
      expect(portfolioService.request).toHaveBeenCalledWith('post', 'portfolio', data);
    });
  });

  describe('editPosition', () => {
    it('chama request com put, portfolio/1 e os novos dados', async () => {
      const data = { quantity: 20 };
      await portfolioService.editPosition(1, data);
      expect(portfolioService.request).toHaveBeenCalledWith('put', 'portfolio/1', data);
    });
  });

  describe('deletePosition', () => {
    it('chama request com delete e portfolio/1', async () => {
      await portfolioService.deletePosition(1);
      expect(portfolioService.request).toHaveBeenCalledWith('delete', 'portfolio/1');
    });
  });
});
