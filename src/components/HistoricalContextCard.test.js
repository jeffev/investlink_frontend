import React from 'react';
import { render, screen } from '@testing-library/react';
import HistoricalContextCard from './HistoricalContextCard';

const indicator = (overrides = {}) => ({
  key: 'p_l',
  label: 'P/L',
  lower_is_better: true,
  current: 8.2,
  median: 12.6,
  min: 6.1,
  max: 18.0,
  deviation_percent: -34.92,
  percentile: 20,
  verdict: 'BARATO',
  years: [2021, 2022, 2023, 2024, 2025],
  ...overrides,
});

describe('HistoricalContextCard', () => {
  it('monta a frase comparando com a mediana da própria empresa', () => {
    render(<HistoricalContextCard context={{ indicators: [indicator()] }} />);

    expect(screen.getByText(/P\/L 8,20/)).toBeInTheDocument();
    expect(
      screen.getByText(/35% abaixo da mediana de 5 anos da própria empresa/)
    ).toBeInTheDocument();
    expect(screen.getByText(/12,60/)).toBeInTheDocument();
  });

  it('diz "acima" quando o múltiplo está acima da mediana', () => {
    render(
      <HistoricalContextCard
        context={{
          indicators: [indicator({ deviation_percent: 30.0, verdict: 'CARO' })],
        }}
      />
    );

    expect(screen.getByText(/30% acima da mediana/)).toBeInTheDocument();
    expect(screen.getByText('Caro vs. histórico')).toBeInTheDocument();
  });

  it('marca o veredito em linha sem alarmar', () => {
    render(
      <HistoricalContextCard
        context={{
          indicators: [indicator({ deviation_percent: 5.0, verdict: 'EM_LINHA' })],
        }}
      />
    );

    expect(screen.getByText('Em linha')).toBeInTheDocument();
  });

  it('lista um indicador por linha', () => {
    render(
      <HistoricalContextCard
        context={{
          indicators: [
            indicator(),
            indicator({ key: 'p_vp', label: 'P/VP', current: 1.29 }),
          ],
        }}
      />
    );

    expect(screen.getByText(/P\/L 8,20/)).toBeInTheDocument();
    expect(screen.getByText(/P\/VP 1,29/)).toBeInTheDocument();
  });

  it('some da tela quando a empresa não tem histórico suficiente', () => {
    // Melhor ausente do que um card vazio dizendo nada.
    const { container } = render(
      <HistoricalContextCard context={{ indicators: [] }} loading={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('some quando o contexto nem chegou', () => {
    const { container } = render(<HistoricalContextCard context={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('mostra o carregamento antes de decidir', () => {
    render(<HistoricalContextCard context={null} loading />);
    expect(screen.getByText('Carregando…')).toBeInTheDocument();
  });

  it('não quebra sem a faixa de mínimo e máximo', () => {
    render(
      <HistoricalContextCard
        context={{ indicators: [indicator({ min: null, max: null })] }}
      />
    );
    expect(screen.getByText(/P\/L 8,20/)).toBeInTheDocument();
  });
});
