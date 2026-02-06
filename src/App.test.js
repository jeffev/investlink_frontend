import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/BarraNavegacao', () => () => <div data-testid="barra-navegacao">BarraNavegacao</div>);
jest.mock('./components/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('./components/Rotas', () => () => <div data-testid="rotas">Rotas</div>);

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renderiza sem quebrar', () => {
    render(<App />);
    expect(screen.getByTestId('barra-navegacao')).toBeInTheDocument();
    expect(screen.getByTestId('rotas')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renderiza BarraNavegacao, Rotas e Footer', () => {
    render(<App />);
    expect(screen.getByText('BarraNavegacao')).toBeInTheDocument();
    expect(screen.getByText('Rotas')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
