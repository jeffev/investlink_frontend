import authService from './auth.service';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

describe('auth.service', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  beforeEach(() => {
    mockGetItem.mockClear();
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();
  });

  describe('isAuthenticated', () => {
    it('retorna false quando não há user em sessionStorage', () => {
      mockGetItem.mockReturnValue(null);
      expect(authService.isAuthenticated()).toBe(false);
      expect(mockGetItem).toHaveBeenCalledWith('user');
    });

    it('retorna true quando há user em sessionStorage', () => {
      mockGetItem.mockReturnValue(JSON.stringify({ profile: 'USER' }));
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('retorna null quando não há user', () => {
      mockGetItem.mockReturnValue(null);
      expect(authService.getCurrentUser()).toBe(null);
    });

    it('retorna profile do user quando há sessão', () => {
      mockGetItem.mockReturnValue(JSON.stringify({ profile: 'ADMIN', user_name: 'test' }));
      expect(authService.getCurrentUser()).toBe('ADMIN');
    });
  });

  describe('getCurrentUsername', () => {
    it('retorna null quando não há user', () => {
      mockGetItem.mockReturnValue(null);
      expect(authService.getCurrentUsername()).toBe(null);
    });

    it('retorna user_name do user quando há sessão', () => {
      mockGetItem.mockReturnValue(JSON.stringify({ profile: 'USER', user_name: 'joao' }));
      expect(authService.getCurrentUsername()).toBe('joao');
    });
  });

  describe('getToken', () => {
    it('retorna null quando não há user', () => {
      mockGetItem.mockReturnValue(null);
      expect(authService.getToken()).toBe(null);
    });

    it('retorna access_token do user quando há sessão', () => {
      mockGetItem.mockReturnValue(JSON.stringify({ access_token: 'abc123' }));
      expect(authService.getToken()).toBe('abc123');
    });
  });

  describe('isAdmin', () => {
    it('retorna false quando não há user', () => {
      mockGetItem.mockReturnValue(null);
      expect(authService.isAdmin()).toBe(false);
    });

    it('retorna false quando profile não é ADMIN', () => {
      mockGetItem.mockReturnValue(JSON.stringify({ profile: 'USER' }));
      expect(authService.isAdmin()).toBe(false);
    });

    it('retorna true quando profile é ADMIN', () => {
      mockGetItem.mockReturnValue(JSON.stringify({ profile: 'ADMIN' }));
      expect(authService.isAdmin()).toBe(true);
    });
  });

  describe('logout', () => {
    it('remove user e estados de lista do sessionStorage', () => {
      authService.logout();
      expect(mockRemoveItem).toHaveBeenCalledWith('user');
      expect(mockRemoveItem).toHaveBeenCalledWith('stateListaAcoes');
      expect(mockRemoveItem).toHaveBeenCalledWith('stateListaFiis');
      expect(mockRemoveItem).toHaveBeenCalledWith('stateListaFavoritas');
      expect(mockRemoveItem).toHaveBeenCalledWith('stateListaFavoritosFiis');
    });
  });

  describe('setUserSession', () => {
    it('grava user no sessionStorage', () => {
      authService.setUserSession({
        profile: 'USER',
        name: 'João',
        user_name: 'joao',
        access_token: 'token',
      });
      expect(mockSetItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({
          profile: 'USER',
          name: 'João',
          user_name: 'joao',
          access_token: 'token',
        })
      );
    });
  });
});
