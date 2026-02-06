import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BarraNavegacao from './BarraNavegacao';
import authService from '../services/auth.service';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('../services/auth.service');

describe('BarraNavegacao', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    sessionStorage.clear();
  });

  it('renderiza o título Invest Link', () => {
    render(
      <MemoryRouter>
        <BarraNavegacao check={false} change={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('Invest Link')).toBeInTheDocument();
  });

  it('mostra botão Login quando usuário não está logado', () => {
    render(
      <MemoryRouter>
        <BarraNavegacao check={false} change={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('mostra botão Logout quando usuário está logado', () => {
    sessionStorage.setItem('user', JSON.stringify({ profile: 'USER' }));
    render(
      <MemoryRouter>
        <BarraNavegacao check={false} change={() => {}} />
      </MemoryRouter>
    );
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('chama logout e navigate ao clicar em Logout', async () => {
    sessionStorage.setItem('user', JSON.stringify({ profile: 'USER' }));
    render(
      <MemoryRouter>
        <BarraNavegacao check={false} change={() => {}} />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(authService.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('chama change ao alternar o switch de dark mode', async () => {
    const change = jest.fn();
    render(
      <MemoryRouter>
        <BarraNavegacao check={false} change={change} />
      </MemoryRouter>
    );
    const switchInput = screen.getByRole('checkbox');
    await userEvent.click(switchInput);
    expect(change).toHaveBeenCalled();
  });
});
