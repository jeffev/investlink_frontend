import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import authService from '../services/auth.service';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../services/auth.service');

describe('Register', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  it('renderiza sem quebrar', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /criar/i })).toBeInTheDocument();
  });

  it('renderiza campo Nome Completo', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
  });

  it('renderiza campo Usuário', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/^usuário/i)).toBeInTheDocument();
  });

  it('renderiza campo E-mail', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
  });

  it('renderiza campo Senha', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('renderiza botão de submit Criar', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /criar/i })).toBeInTheDocument();
  });

  it('navega para /home após registro bem-sucedido', async () => {
    authService.register.mockResolvedValue({ status: 201 });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/^usuário/i), { target: { value: 'joao' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha123' } });
    fireEvent.submit(screen.getByRole('button', { name: /criar/i }).closest('form'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('exibe mensagem de erro quando authService lança exceção', async () => {
    authService.register.mockRejectedValue(new Error('Network error'));
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/^usuário/i), { target: { value: 'joao' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha' } });
    fireEvent.submit(screen.getByRole('button', { name: /criar/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Erro ao criar usuário')).toBeInTheDocument();
    });
  });

  it('exibe mensagem de erro quando register retorna status diferente de 201', async () => {
    authService.register.mockResolvedValue({
      status: 400,
      data: { message: 'E-mail já cadastrado' },
    });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João' } });
    fireEvent.change(screen.getByLabelText(/^usuário/i), { target: { value: 'joao' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha' } });
    fireEvent.submit(screen.getByRole('button', { name: /criar/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText('E-mail já cadastrado')).toBeInTheDocument();
    });
  });

  it('renderiza link para fazer login', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByText(/já possui uma conta\? entrar/i)).toBeInTheDocument();
  });
});
