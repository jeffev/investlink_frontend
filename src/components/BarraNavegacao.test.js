import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BarraNavegacao from './BarraNavegacao';
import authService from '../services/auth.service';
import StockService from '../services/stock.service';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('../services/auth.service');
jest.mock('../services/stock.service', () => ({ getAlerts: jest.fn() }));

const renderNav = (props = {}) =>
  render(
    <MemoryRouter>
      <BarraNavegacao check={false} change={() => {}} {...props} />
    </MemoryRouter>
  );

const logar = () =>
  sessionStorage.setItem('user', JSON.stringify({ profile: 'USER' }));

describe('BarraNavegacao', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    sessionStorage.clear();
    StockService.getAlerts.mockResolvedValue([]);
    authService.isAdmin.mockReturnValue(false);
  });

  it('renderiza o título Invest Link', () => {
    renderNav();
    expect(screen.getByText('Invest Link')).toBeInTheDocument();
  });

  it('mostra botão Login quando usuário não está logado', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('não mostra a navegação do produto para quem não entrou', () => {
    renderNav();
    expect(screen.queryByRole('button', { name: 'Oportunidades' })).not.toBeInTheDocument();
  });

  it('mostra os destinos principais na barra, sem abrir gaveta', () => {
    // Estavam todos atrás do ícone de hambúrguer — inclusive numa tela larga,
    // onde ninguém descobria que Oportunidades ou Carteira existiam.
    logar();
    renderNav();

    expect(screen.getByRole('link', { name: 'Oportunidades' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carteira' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ações/i })).toBeInTheDocument();
  });

  it('agrupa lista e favoritas dentro do menu de Ações', async () => {
    logar();
    renderNav();

    await userEvent.click(screen.getByRole('button', { name: /ações/i }));

    expect(
      await screen.findByRole('menuitem', { name: 'Lista de ações' })
    ).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Favoritas' })).toBeInTheDocument();
  });

  it('não oferece destino que não existe', () => {
    // "/sentimento" ficou no menu sem rota nem página: quem clicava caía numa
    // tela em branco.
    logar();
    renderNav();
    expect(screen.queryByText(/sentimento/i)).not.toBeInTheDocument();
  });

  it('chama logout e navigate pelo menu da conta', async () => {
    logar();
    renderNav();

    await userEvent.click(screen.getByRole('button', { name: /conta/i }));
    await userEvent.click(await screen.findByRole('menuitem', { name: /logout/i }));

    expect(authService.logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('esconde o Admin de quem não é administrador', async () => {
    logar();
    renderNav();

    await userEvent.click(screen.getByRole('button', { name: /conta/i }));

    expect(await screen.findByRole('menuitem', { name: /meu perfil/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /admin/i })).not.toBeInTheDocument();
  });

  it('chama change ao alternar o tema', async () => {
    const change = jest.fn();
    renderNav({ change });

    await userEvent.click(screen.getByRole('button', { name: /alternar tema/i }));

    expect(change).toHaveBeenCalled();
  });

  it('o alerta de preço fica visível mesmo zerado', async () => {
    // Antes o sino só aparecia com alerta pendente, e a barra dançava.
    logar();
    renderNav();

    expect(
      await screen.findByRole('link', { name: /alertas de preço/i })
    ).toBeInTheDocument();
  });
});
