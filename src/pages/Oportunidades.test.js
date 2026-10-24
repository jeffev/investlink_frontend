import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Oportunidades from './Oportunidades';
import StockService from '../services/stock.service';

jest.mock('../services/stock.service', () => ({
  getOpportunities: jest.fn(),
  getScoreProfiles: jest.fn(),
  getScoreBacktest: jest.fn(),
  getLastRefresh: jest.fn(),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <Oportunidades />
    </MemoryRouter>
  );

const profiles = {
  data: [
    { key: 'EQUILIBRADO', label: 'Equilibrado', weights: {}, default: true },
    { key: 'DIVIDENDOS', label: 'Dividendos', weights: {}, default: false },
  ],
};

const opportunity = (overrides = {}) => ({
  ticker: 'POMO4',
  companyname: 'Marcopolo',
  sectorname: 'Bens Industriais',
  price: 4.6,
  fundamentals_source: 'CVM',
  fundamentals_date: '2026-06-30',
  score: {
    score_total: 64.9,
    pillars: [
      { key: 'valuation', label: 'Valuation', value: 46 },
      { key: 'qualidade', label: 'Qualidade', value: 66 },
    ],
    reasons: [
      { code: 'PILAR_DIVIDENDOS', message: 'Dividendos acima da média do setor (95/100)' },
    ],
    red_flags: [
      { code: 'DY_IMPLAUSIVEL', message: 'DY de 22,3% dificilmente se repete' },
    ],
    eligible: true,
    exclusion_reasons: [],
  },
  ...overrides,
});

describe('Oportunidades', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // A aba escolhida fica no sessionStorage. Sem limpar, o teste que troca
    // para FII deixaria a página abrindo em FII em todos os seguintes.
    sessionStorage.clear();
    StockService.getScoreProfiles.mockResolvedValue(profiles);
    StockService.getScoreBacktest.mockResolvedValue({ years: [], caveats: [] });
    StockService.getLastRefresh.mockResolvedValue({
      status: 'OK',
      started_at: new Date().toISOString(),
    });
  });

  it('renderiza o título da página', async () => {
    StockService.getOpportunities.mockResolvedValue({ data: [] });

    renderPage();

    expect(screen.getByText('Oportunidades')).toBeInTheDocument();
  });

  it('monta o card com motivo e alerta vindos do backend', async () => {
    StockService.getOpportunities.mockResolvedValue({ data: [opportunity()] });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('POMO4')).toBeInTheDocument();
    });
    expect(
      screen.getByText('Dividendos acima da média do setor (95/100)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('DY de 22,3% dificilmente se repete')
    ).toBeInTheDocument();
    // O caixa alta vem do CSS (variante overline); no DOM o texto é normal.
    expect(screen.getByText(/por que está aqui/i)).toBeInTheDocument();
    expect(screen.getByText(/o que pode dar errado/i)).toBeInTheDocument();
  });

  it('mostra a procedência do fundamento no card', async () => {
    StockService.getOpportunities.mockResolvedValue({ data: [opportunity()] });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('CVM · 12m')).toBeInTheDocument();
    });
  });

  it('exibe os perfis disponíveis', async () => {
    StockService.getOpportunities.mockResolvedValue({ data: [] });

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Dividendos' })).toBeInTheDocument();
    });
  });

  it('recarrega ao trocar de perfil', async () => {
    StockService.getOpportunities.mockResolvedValue({ data: [] });

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Dividendos' })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Dividendos' }));

    await waitFor(() => {
      expect(StockService.getOpportunities).toHaveBeenCalledWith(
        'DIVIDENDOS',
        12,
        'ACAO',
        expect.any(Object)
      );
    });
  });

  it('explica a lista vazia pelos filtros, não por falta de dado', async () => {
    StockService.getOpportunities.mockResolvedValue({ data: [] });

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText(/Nenhuma ação passou pelos filtros/)
      ).toBeInTheDocument();
    });
  });

  it('exibe erro quando a busca falha', async () => {
    StockService.getOpportunities.mockRejectedValue(new Error('boom'));

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar as oportunidades.')
      ).toBeInTheDocument();
    });
  });

  it('continua funcionando quando os perfis não carregam', async () => {
    StockService.getScoreProfiles.mockRejectedValue(new Error('offline'));
    StockService.getOpportunities.mockResolvedValue({ data: [opportunity()] });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('POMO4')).toBeInTheDocument();
    });
  });

  describe('vitrine de FII', () => {
    const fiiProfiles = {
      data: [
        { key: 'EQUILIBRADO', label: 'Equilibrado', weights: {}, default: true },
        { key: 'RENDA', label: 'Renda', weights: {}, default: false },
      ],
    };

    const fundo = {
      ticker: 'HGLG11',
      companyname: 'CSHG Logística',
      segment: 'Logística',
      price: 147.6,
      p_vp: 0.89,
      dy: 8.97,
      vacancia_media: 2.41,
      qtd_imoveis: 37,
      score: {
        score_total: 84.2,
        pillars: [{ key: 'renda', label: 'Renda', value: 81 }],
        reasons: [{ code: 'P_VP_DESCONTO', message: 'Cota a 0,89× o patrimonial' }],
        red_flags: [],
        eligible: true,
        exclusion_reasons: [],
      },
    };

    beforeEach(() => {
      StockService.getScoreProfiles.mockImplementation((assetType) =>
        Promise.resolve(assetType === 'FII' ? fiiProfiles : profiles)
      );
      StockService.getOpportunities.mockImplementation((_p, _l, assetType) =>
        Promise.resolve({ data: assetType === 'FII' ? [fundo] : [opportunity()] })
      );
    });

    const trocarParaFii = async () => {
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'FIIs' })).toBeInTheDocument();
      });
      await userEvent.click(screen.getByRole('tab', { name: 'FIIs' }));
    };

    it('busca a vitrine do fundo ao trocar de aba', async () => {
      renderPage();
      await trocarParaFii();

      await waitFor(() => {
        expect(StockService.getOpportunities).toHaveBeenCalledWith(
          'EQUILIBRADO',
          12,
          'FII',
          expect.any(Object)
        );
      });
    });

    it('troca os perfis pelos do fundo', async () => {
      // DIVIDENDOS existe para ação e não para fundo. Se a aba antiga
      // sobrevivesse, a próxima busca voltaria 400.
      renderPage();
      await trocarParaFii();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Renda' })).toBeInTheDocument();
      });
      expect(screen.queryByRole('button', { name: 'Dividendos' })).not.toBeInTheDocument();
    });

    it('não repete o ticker como subtítulo do card', async () => {
      // O Fundamentus não publica o nome do fundo e a coleta preenche o
      // `companyname` com o próprio ticker; o card mostrava HGLG11 duas vezes.
      StockService.getOpportunities.mockImplementation((_p, _l, assetType) =>
        Promise.resolve({
          data:
            assetType === 'FII'
              ? [{ ...fundo, companyname: 'HGLG11' }]
              : [opportunity()],
        })
      );

      renderPage();
      await trocarParaFii();

      await waitFor(() => {
        expect(screen.getByText('HGLG11')).toBeInTheDocument();
      });
      expect(screen.getAllByText('HGLG11')).toHaveLength(1);
      // O segmento continua no chip, uma vez só.
      expect(screen.getAllByText('Logística')).toHaveLength(1);
    });

    it('monta o card com os indicadores do fundo', async () => {
      renderPage();
      await trocarParaFii();

      await waitFor(() => {
        expect(screen.getByText('HGLG11')).toBeInTheDocument();
      });
      // Valor em cima, rótulo embaixo — alinhados entre os cards da grade,
      // em vez de chips que quebravam a linha e desalinhavam tudo.
      expect(screen.getByText('0,89')).toBeInTheDocument();
      expect(screen.getByText('P/VP')).toBeInTheDocument();
      expect(screen.getByText('8,97%')).toBeInTheDocument();
    });

    it('não pede o backtest, que só existe para ações', async () => {
      renderPage();
      await waitFor(() => {
        expect(StockService.getScoreBacktest).toHaveBeenCalledTimes(1);
      });

      await trocarParaFii();
      await waitFor(() => {
        expect(screen.getByText('HGLG11')).toBeInTheDocument();
      });

      // Continua em uma: a troca para FII não disparou outra medição.
      expect(StockService.getScoreBacktest).toHaveBeenCalledTimes(1);
    });
  });

  describe('momento do ciclo e filtros', () => {
    const comCiclo = (overrides = {}) => ({
      ...opportunity(),
      queda_12m: -41.6,
      cycle_state: 'OPORTUNIDADE_DE_CICLO',
      cycle_message: 'Caiu 42% do topo de 12 meses e o lucro segue crescendo',
      ...overrides,
    });

    it('mostra a tarja de queda com fundamento de pé', async () => {
      // O score responde "é bom?"; a tarja responde "é hora?".
      StockService.getOpportunities.mockResolvedValue({ data: [comCiclo()] });

      renderPage();

      await waitFor(() => {
        expect(screen.getByText(/caiu 42% do topo/i)).toBeInTheDocument();
      });
    });

    it('avisa quando o ativo está no topo do próprio ciclo', async () => {
      StockService.getOpportunities.mockResolvedValue({
        data: [
          comCiclo({
            queda_12m: -1.2,
            cycle_state: 'PERTO_DO_TOPO',
            cycle_message: 'Perto da máxima de 12 meses',
          }),
        ],
      });

      renderPage();

      await waitFor(() => {
        expect(screen.getByText(/no topo de 12 meses/i)).toBeInTheDocument();
      });
    });

    it('separa queda com deterioração de queda com desconto', async () => {
      // Queda grande sozinha seleciona ativo quebrado, não pechincha.
      StockService.getOpportunities.mockResolvedValue({
        data: [
          comCiclo({
            cycle_state: 'QUEDA_COM_DETERIORACAO',
            cycle_message: 'Caiu 32% mas o lucro caiu junto',
          }),
        ],
      });

      renderPage();

      await waitFor(() => {
        expect(screen.getByText(/queda com deterioração/i)).toBeInTheDocument();
      });
    });

    it('o filtro de queda vai para o servidor, não para a lista recebida', async () => {
      // Peneirar os doze cards recebidos deixaria três; o recorte precisa
      // acontecer na consulta.
      StockService.getOpportunities.mockResolvedValue({ data: [] });

      renderPage();
      await waitFor(() => {
        expect(screen.getByLabelText(/só quem caiu do topo/i)).toBeInTheDocument();
      });

      await userEvent.click(screen.getByLabelText(/só quem caiu do topo/i));

      await waitFor(() => {
        expect(StockService.getOpportunities).toHaveBeenLastCalledWith(
          expect.anything(),
          12,
          'ACAO',
          expect.objectContaining({ onlyDrawdown: true })
        );
      });
    });

    it('mostra de quando é o dado na tela', async () => {
      StockService.getOpportunities.mockResolvedValue({ data: [] });

      renderPage();

      await waitFor(() => {
        expect(screen.getByText(/atualizado/i)).toBeInTheDocument();
      });
    });

    it('leva os selecionados para o comparador', async () => {
      StockService.getOpportunities.mockResolvedValue({
        data: [comCiclo(), comCiclo({ ticker: 'VALE3' })],
      });

      renderPage();
      await waitFor(() => {
        expect(screen.getByText('VALE3')).toBeInTheDocument();
      });

      await userEvent.click(screen.getByLabelText('Comparar POMO4'));
      await userEvent.click(screen.getByLabelText('Comparar VALE3'));

      const botao = screen.getByRole('link', { name: /comparar 2/i });
      expect(botao).toHaveAttribute('href', '/comparar?tickers=POMO4,VALE3');
    });
  });
});
