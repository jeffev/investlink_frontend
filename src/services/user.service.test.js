jest.mock('./api.service', () => class ApiService {
  async request() {}
});

import userService from './user.service';

describe('user.service', () => {
  beforeEach(() => {
    jest.spyOn(userService, 'request').mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getUsers chama request com get e users', async () => {
    await userService.getUsers();
    expect(userService.request).toHaveBeenCalledWith('get', 'users');
  });

  it('deleteUser chama request com delete e user/5', async () => {
    await userService.deleteUser(5);
    expect(userService.request).toHaveBeenCalledWith('delete', 'user/5');
  });

  it('changePassword chama request com put, url e dados', async () => {
    const data = { current_password: 'old', new_password: 'new' };
    await userService.changePassword(3, data);
    expect(userService.request).toHaveBeenCalledWith('put', 'user/3/password', data);
  });
});
