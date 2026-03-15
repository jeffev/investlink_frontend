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

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  it('renderiza sem quebrar', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('renderiza campo de usuário', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
  });

  it('renderiza campo de senha', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('renderiza botão de submit Entrar', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('exibe erro de campo obrigatório ao submeter formulário vazio', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getAllByText('Campo obrigatório').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('não chama authService.login quando campos estão vazios', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  it('navega para /home após login bem-sucedido', async () => {
    authService.login.mockResolvedValue({ status: 200 });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'joao' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha123' } });
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }).closest('form'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('exibe mensagem de erro quando login retorna status diferente de 200', async () => {
    authService.login.mockResolvedValue({ status: 401 });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'joao' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'errada' } });
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Usuário ou senha inválidos')).toBeInTheDocument();
    });
  });

  it('exibe mensagem de erro quando authService lança exceção', async () => {
    authService.login.mockRejectedValue(new Error('Network error'));
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'joao' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha' } });
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Erro ao fazer login')).toBeInTheDocument();
    });
  });

  it('renderiza link para criar conta', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText(/não tem uma conta\? criar/i)).toBeInTheDocument();
  });
});
