import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScoreBacktestCard from './ScoreBacktestCard';

const backtest = (overrides = {}) => ({
  profile: 'EQUILIBRADO',
  summary: {
    years: 2,
    top_decile_annualised: 28.4,
    universe_annualised: 12.1,
    beat_universe_in: 2,
  },
  years: [
    {
      year: 2021,
      holding_period: '2021-12-31 → 2022-12-31',
      universe_size: 180,
      selected: 18,
      top_decile_return: 31.2,
      universe_return: 10.0,
      excess_return: 21.2,
    },
    {
      year: 2022,
      holding_period: '2022-12-31 → 2023-12-31',
      universe_size: 190,
      selected: 19,
      top_decile_return: -5.0,
      universe_return: -12.0,
      excess_return: 7.0,
    },
  ],
  caveats: [
    { code: 'VIES_SOBREVIVENCIA', message: 'O universo só contém empresas que existem hoje.' },
    { code: 'COMPARADOR_NAO_E_IBOV', message: 'O comparador não é o Ibovespa.' },
  ],
  ...overrides,
});

const abrir = async () => {
  await userEvent.click(
    screen.getByRole('button', { name: /Como este score se saiu no passado/ })
  );
};

describe('ScoreBacktestCard', () => {
  it('começa recolhido — o backtest não é o assunto principal da página', () => {
    render(<ScoreBacktestCard backtest={backtest()} />);
    // O MUI mantém o conteúdo no DOM e esconde por CSS, então a pergunta é
    // se está visível, não se existe.
    expect(screen.getByText('2021-12-31 → 2022-12-31')).not.toBeVisible();
  });

  it('mostra as ressalvas junto com os números', async () => {
    render(<ScoreBacktestCard backtest={backtest()} />);
    await abrir();

    // Sem as limitações ao lado, o número vira promessa de retorno.
    expect(screen.getByText('Leia antes de olhar os números')).toBeInTheDocument();
    expect(
      screen.getByText('O universo só contém empresas que existem hoje.')
    ).toBeInTheDocument();
    expect(screen.getByText('O comparador não é o Ibovespa.')).toBeInTheDocument();
  });

  it('avisa que o score de cada ano usa os múltiplos daquele ano', async () => {
    render(<ScoreBacktestCard backtest={backtest()} />);
    await abrir();
    expect(screen.getByText(/não sabe nada de 2022/)).toBeInTheDocument();
  });

  it('lista um período por linha com a diferença', async () => {
    render(<ScoreBacktestCard backtest={backtest()} />);
    await abrir();

    expect(screen.getByText('2021-12-31 → 2022-12-31')).toBeInTheDocument();
    expect(screen.getByText('21,20%')).toBeInTheDocument();
    expect(screen.getByText('7,00%')).toBeInTheDocument();
  });

  it('resume o anualizado dos dois lados', async () => {
    render(<ScoreBacktestCard backtest={backtest()} />);
    await abrir();

    expect(screen.getByText(/Decil de topo: 28,40% a\.a\./)).toBeInTheDocument();
    expect(screen.getByText(/Média do universo: 12,10% a\.a\./)).toBeInTheDocument();
    expect(screen.getByText('Bateu em 2 de 2 anos')).toBeInTheDocument();
  });

  it('explica a ausência de resultado em vez de mostrar tabela vazia', async () => {
    render(<ScoreBacktestCard backtest={backtest({ years: [] })} />);
    await abrir();
    expect(screen.getByText(/Sem histórico suficiente/)).toBeInTheDocument();
  });

  it('mostra o erro quando a medição falha', async () => {
    render(<ScoreBacktestCard backtest={null} error="deu ruim" />);
    await abrir();
    expect(screen.getByText('deu ruim')).toBeInTheDocument();
  });

  it('mostra carregamento sem quebrar', async () => {
    render(<ScoreBacktestCard backtest={null} loading />);
    await abrir();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
