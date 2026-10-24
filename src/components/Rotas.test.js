import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Rotas from './Rotas';
import authService from '../services/auth.service';

jest.mock('../services/auth.service');
jest.mock('../pages/Home.js', () => () => <div>Home</div>);
jest.mock('../pages/Login.js', () => () => <div>Login</div>);
jest.mock('../pages/Register.js', () => () => <div>Register</div>);
jest.mock('../pages/ListaAcoes.js', () => () => <div>ListaAcoes</div>);
jest.mock('../pages/ListaFiis.js', () => () => <div>ListaFiis</div>);
jest.mock('../pages/Favoritas.js', () => () => <div>Favoritas</div>);
jest.mock('../pages/FiisFavoritos.js', () => () => <div>FiisFavoritos</div>);
jest.mock('../pages/FiiDetalhe.js', () => () => <div>FiiDetalhe</div>);
jest.mock('../pages/Admin.js', () => () => <div>Admin</div>);
jest.mock('../pages/Perfil.js', () => () => <div>Perfil</div>);

describe('Rotas', () => {
  it('redireciona para Login quando não autenticado ao acessar rota raiz', () => {
    authService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={['/']}>
        <Rotas />
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renderiza Home quando autenticado na rota raiz', () => {
    authService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={['/']}>
        <Rotas />
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renderiza Login na rota /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Rotas />
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renderiza Register na rota /registrar', () => {
    render(
      <MemoryRouter initialEntries={['/registrar']}>
        <Rotas />
      </MemoryRouter>
    );
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('avisa que a página não existe em endereço desconhecido', () => {
    // Sem o curinga, o roteador não casava nada e devolvia tela em branco —
    // o que um link velho faz parecer site quebrado.
    authService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={['/acoes']}>
        <Rotas />
      </MemoryRouter>
    );
    expect(screen.getByText('Esta página não existe')).toBeInTheDocument();
  });

  it('não exige login para dizer que a página não existe', () => {
    authService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={['/pagina-que-nunca-existiu']}>
        <Rotas />
      </MemoryRouter>
    );
    expect(screen.getByText('Esta página não existe')).toBeInTheDocument();
  });
});

