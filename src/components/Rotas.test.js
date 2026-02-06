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
});

