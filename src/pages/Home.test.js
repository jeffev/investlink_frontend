import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import StockService from '../services/stock.service';
import PortfolioService from '../services/portfolio.service';

jest.mock('../services/stock.service', () => ({
  getFavorites: jest.fn(),
  getPredictions: jest.fn(),
}));
jest.mock('../services/portfolio.service', () => ({
  getPortfolioSummary: jest.fn(),
}));

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o título Dashboard', async () => {
    StockService.getFavorites.mockResolvedValue([]);
    StockService.getPredictions.mockResolvedValue({ data: [] });
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('exibe card Minhas Favoritas após carregamento', async () => {
    StockService.getFavorites.mockResolvedValue([]);
    StockService.getPredictions.mockResolvedValue({ data: [] });
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Minhas Favoritas')).toBeInTheDocument();
    });
  });

  it('exibe card Top Picks ML após carregamento', async () => {
    StockService.getFavorites.mockResolvedValue([]);
    StockService.getPredictions.mockResolvedValue({ data: [] });
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Top Picks ML (BARATA)')).toBeInTheDocument();
    });
  });

  it('não exibe PortfolioCard quando total_invested é 0', async () => {
    StockService.getFavorites.mockResolvedValue([]);
    StockService.getPredictions.mockResolvedValue({ data: [] });
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();

    await waitFor(() => {
      expect(screen.queryByText('Meu Portfólio')).not.toBeInTheDocument();
    });
  });

  it('exibe PortfolioCard quando total_invested é maior que 0', async () => {
    StockService.getFavorites.mockResolvedValue([]);
    StockService.getPredictions.mockResolvedValue({ data: [] });
    PortfolioService.getPortfolioSummary.mockResolvedValue({
      total_invested: 5000,
      current_value: 5200,
      total_pnl: 200,
      total_pnl_percent: 4,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Meu Portfólio')).toBeInTheDocument();
    });
  });

  it('exibe favoritas na lista quando retornadas pelo serviço', async () => {
    StockService.getFavorites.mockResolvedValue([
      { stock: { ticker: 'PETR4', price: 38.5, ml_label: 'BARATA' } },
      { stock: { ticker: 'VALE3', price: 62.1, ml_label: 'NEUTRA' } },
    ]);
    StockService.getPredictions.mockResolvedValue({ data: [] });
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('PETR4')).toBeInTheDocument();
      expect(screen.getByText('VALE3')).toBeInTheDocument();
    });
  });

  it('exibe mensagem quando não há favoritas', async () => {
    StockService.getFavorites.mockResolvedValue([]);
    StockService.getPredictions.mockResolvedValue({ data: [] });
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Nenhuma favorita adicionada.')).toBeInTheDocument();
    });
  });

  it('exibe top picks filtrados como BARATA', async () => {
    StockService.getFavorites.mockResolvedValue([]);
    StockService.getPredictions.mockResolvedValue({
      data: [
        { ticker: 'WEGE3', label: 'BARATA', prob_barata: 0.85, composite_score: 90 },
        { ticker: 'MGLU3', label: 'CARA', prob_barata: 0.1, composite_score: 20 },
      ],
    });
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('WEGE3')).toBeInTheDocument();
      expect(screen.queryByText('MGLU3')).not.toBeInTheDocument();
    });
  });

  it('exibe mensagem quando não há previsões disponíveis', async () => {
    StockService.getFavorites.mockResolvedValue([]);
    StockService.getPredictions.mockResolvedValue({ data: [] });
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Sem previsões disponíveis.')).toBeInTheDocument();
    });
  });

  it('lida com erro no getFavorites sem quebrar', async () => {
    StockService.getFavorites.mockRejectedValue(new Error('Network error'));
    StockService.getPredictions.mockResolvedValue({ data: [] });
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Minhas Favoritas')).toBeInTheDocument();
    });
  });

  it('lida com erro no getPredictions sem quebrar', async () => {
    StockService.getFavorites.mockResolvedValue([]);
    StockService.getPredictions.mockRejectedValue(new Error('Network error'));
    PortfolioService.getPortfolioSummary.mockResolvedValue({ total_invested: 0 });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Top Picks ML (BARATA)')).toBeInTheDocument();
    });
  });
});
