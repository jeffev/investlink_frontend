import userLayoutService from './userLayout.service';

describe('userLayout.service', () => {
  beforeEach(() => {
    jest.spyOn(userLayoutService, 'request').mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('saveLayout', () => {
    it('chama request com post, user_layout e o objeto com layout e estado', async () => {
      const layout = 'stateListaAcoes';
      const estado = { columnOrder: ['ticker', 'price'] };
      await userLayoutService.saveLayout(layout, estado);
      expect(userLayoutService.request).toHaveBeenCalledWith('post', 'user_layout', {
        layout,
        estado,
      });
    });
  });

  describe('getLayout', () => {
    it('chama request com get e user_layout/{layout}', async () => {
      await userLayoutService.getLayout('stateListaAcoes');
      expect(userLayoutService.request).toHaveBeenCalledWith('get', 'user_layout/stateListaAcoes');
    });

    it('chama request com o nome de layout correto para FIIs', async () => {
      await userLayoutService.getLayout('stateListaFiis');
      expect(userLayoutService.request).toHaveBeenCalledWith('get', 'user_layout/stateListaFiis');
    });
  });
});
