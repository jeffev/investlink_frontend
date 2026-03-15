jest.mock('./api.service', () => class ApiService {
  async request() {}
});

import fiiService from './fii.service';

describe('fii.service', () => {
  beforeEach(() => {
    jest.spyOn(fiiService, 'request').mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllFIIs', () => {
    it('chama request com get e url contendo fiis', async () => {
      await fiiService.getAllFIIs({ page: 1, pageSize: 50, sorting: [], columnFilters: [] });
      expect(fiiService.request).toHaveBeenCalledWith('get', expect.stringContaining('fiis'));
    });

    it('inclui page e per_page nos params', async () => {
      await fiiService.getAllFIIs({ page: 3, pageSize: 20, sorting: [], columnFilters: [] });
      const endpoint = fiiService.request.mock.calls[0][1];
      expect(endpoint).toContain('page=3');
      expect(endpoint).toContain('per_page=20');
    });

    it('inclui sort_by e sort_dir quando sorting está preenchido', async () => {
      await fiiService.getAllFIIs({
        page: 1,
        pageSize: 50,
        sorting: [{ id: 'dividend_yield', desc: false }],
        columnFilters: [],
      });
      const endpoint = fiiService.request.mock.calls[0][1];
      expect(endpoint).toContain('sort_by=dividend_yield');
      expect(endpoint).toContain('sort_dir=asc');
    });

    it('inclui filters quando columnFilters está preenchido', async () => {
      const filters = [{ id: 'segment', value: 'Logística' }];
      await fiiService.getAllFIIs({ page: 1, pageSize: 50, sorting: [], columnFilters: filters });
      const endpoint = fiiService.request.mock.calls[0][1];
      expect(endpoint).toContain('filters=');
    });

    it('usa valores padrão quando chamado sem argumentos', async () => {
      await fiiService.getAllFIIs();
      expect(fiiService.request).toHaveBeenCalledWith('get', expect.stringContaining('fiis'));
    });
  });

  describe('addFavorite', () => {
    it('chama request com post e favorites/fii/HGLG11', async () => {
      await fiiService.addFavorite('HGLG11');
      expect(fiiService.request).toHaveBeenCalledWith('post', 'favorites/fii/HGLG11');
    });
  });

  describe('removeFavorite', () => {
    it('chama request com delete e favorites/fii/HGLG11', async () => {
      await fiiService.removeFavorite('HGLG11');
      expect(fiiService.request).toHaveBeenCalledWith('delete', 'favorites/fii/HGLG11');
    });
  });

  describe('getFavorites', () => {
    it('chama request com get e favorites/fii', async () => {
      await fiiService.getFavorites();
      expect(fiiService.request).toHaveBeenCalledWith('get', 'favorites/fii');
    });
  });

  describe('editFavorite', () => {
    it('chama request com put, favorite/fii/1 e os novos dados', async () => {
      const newData = { ceiling_price: 100 };
      await fiiService.editFavorite(1, newData);
      expect(fiiService.request).toHaveBeenCalledWith('put', 'favorite/fii/1', newData);
    });
  });

  describe('updateFIIs', () => {
    it('chama request com put e fiis/update-fiis', async () => {
      await fiiService.updateFIIs();
      expect(fiiService.request).toHaveBeenCalledWith('put', 'fiis/update-fiis');
    });
  });
});
