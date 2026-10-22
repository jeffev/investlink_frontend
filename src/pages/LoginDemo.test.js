import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import authService from '../services/auth.service';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../services/auth.service');

jest.mock('../config/api', () => ({
  API_URL: 'http://api/v1/',
  HEALTH_URL: 'http://api/health',
  IS_DEMO: true,
}));

function renderLogin() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login na demo pública', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('entra com a conta demo sem digitar nada', async () => {
    authService.loginAsDemo.mockResolvedValue({ status: 200 });
    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: /entrar como visitante/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    expect(authService.loginAsDemo).toHaveBeenCalled();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('esconde o convite de cadastro, que está fechado na demo', () => {
    renderLogin();
    expect(screen.queryByText(/criar agora/i)).not.toBeInTheDocument();
  });

  it('acorda o servidor ao abrir a tela', () => {
    renderLogin();
    expect(authService.wakeUpServer).toHaveBeenCalled();
  });
});
