jest.mock('./api.service', () => class ApiService {
  async request() {}
});

import stockService from './stock.service';

describe('stock.service', () => {
  beforeEach(() => {
    jest.spyOn(stockService, 'request').mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllStocks', () => {
    it('chama request com get e url contendo stocks', async () => {
      await stockService.getAllStocks({ page: 1, pageSize: 50, sorting: [], columnFilters: [] });
      expect(stockService.request).toHaveBeenCalledWith('get', expect.stringContaining('stocks'));
    });

    it('inclui page e per_page nos params', async () => {
      await stockService.getAllStocks({ page: 2, pageSize: 25, sorting: [], columnFilters: [] });
      const endpoint = stockService.request.mock.calls[0][1];
      expect(endpoint).toContain('page=2');
      expect(endpoint).toContain('per_page=25');
    });

    it('inclui sort_by e sort_dir quando sorting está preenchido', async () => {
      await stockService.getAllStocks({
        page: 1,
        pageSize: 50,
        sorting: [{ id: 'price', desc: true }],
        columnFilters: [],
      });
      const endpoint = stockService.request.mock.calls[0][1];
      expect(endpoint).toContain('sort_by=price');
      expect(endpoint).toContain('sort_dir=desc');
    });

    it('inclui filters quando columnFilters está preenchido', async () => {
      const filters = [{ id: 'sector', value: 'Energia' }];
      await stockService.getAllStocks({ page: 1, pageSize: 50, sorting: [], columnFilters: filters });
      const endpoint = stockService.request.mock.calls[0][1];
      expect(endpoint).toContain('filters=');
    });

    it('usa valores padrão quando chamado sem argumentos', async () => {
      await stockService.getAllStocks();
      expect(stockService.request).toHaveBeenCalledWith('get', expect.stringContaining('stocks'));
    });
  });

  describe('getStock', () => {
    it('chama request com get e stock/PETR4', async () => {
      await stockService.getStock('PETR4');
      expect(stockService.request).toHaveBeenCalledWith('get', 'stock/PETR4');
    });

    it('converte ticker para maiúsculas', async () => {
      await stockService.getStock('petr4');
      expect(stockService.request).toHaveBeenCalledWith('get', 'stock/PETR4');
    });
  });

  describe('addFavorite', () => {
    it('chama request com post e favorites/PETR4', async () => {
      await stockService.addFavorite('PETR4');
      expect(stockService.request).toHaveBeenCalledWith('post', 'favorites/PETR4');
    });
  });

  describe('removeFavorite', () => {
    it('chama request com delete e favorites/PETR4', async () => {
      await stockService.removeFavorite('PETR4');
      expect(stockService.request).toHaveBeenCalledWith('delete', 'favorites/PETR4');
    });
  });

  describe('getFavorites', () => {
    it('chama request com get e favorites', async () => {
      await stockService.getFavorites();
      expect(stockService.request).toHaveBeenCalledWith('get', 'favorites?page=1&per_page=50');
    });
  });

  describe('editFavorite', () => {
    it('chama request com put, favorite/1 e os novos dados', async () => {
      const newData = { ceiling_price: 30 };
      await stockService.editFavorite(1, newData);
      expect(stockService.request).toHaveBeenCalledWith('put', 'favorite/1', newData);
    });
  });

  describe('updateStocks', () => {
    it('chama request com put e stocks/update-stocks', async () => {
      await stockService.updateStocks();
      expect(stockService.request).toHaveBeenCalledWith('put', 'stocks/update-stocks');
    });
  });

  describe('getPredictions', () => {
    it('chama request com get e stocks/predictions', async () => {
      await stockService.getPredictions();
      expect(stockService.request).toHaveBeenCalledWith('get', 'stocks/predictions');
    });
  });
});
