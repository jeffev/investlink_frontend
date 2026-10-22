import { CEILING_CONSTANTS, computeCeilingPrices } from './ceilingPrices';

const acao = (overrides = {}) => ({
  price: 20,
  dy: 6,
  receitas_cagr5: 5,
  ...overrides,
});

describe('computeCeilingPrices', () => {
  it('calcula o teto de Bazin como o preço que renderia 6%', () => {
    // DY 6% sobre R$20 = R$1,20 de dividendo. Para render 6%: 1,20 / 0,06 = 20.
    const { bazin_teto } = computeCeilingPrices(acao());
    expect(bazin_teto).toBeCloseTo(20, 5);
  });

  it('marca desconto positivo quando o preço está abaixo do teto', () => {
    // Mesmo dividendo, preço menor: sobra desconto.
    const { bazin_teto, bazin_discount } = computeCeilingPrices(
      acao({ price: 10, dy: 12 })
    );
    expect(bazin_teto).toBeCloseTo(20, 5);
    expect(bazin_discount).toBeCloseTo(50, 5);
  });

  it('calcula Gordon descontando o crescimento do retorno exigido', () => {
    // Dividendo 1,20 / (0,12 − 0,05) = 17,14
    const { gordon_teto } = computeCeilingPrices(acao());
    expect(gordon_teto).toBeCloseTo(1.2 / (0.12 - 0.05), 4);
  });

  it('limita o crescimento para o denominador de Gordon não explodir', () => {
    // CAGR de 80% não vira crescimento perpétuo de 80%: nenhuma empresa
    // cresce acima do retorno exigido para sempre.
    const { gordon_teto } = computeCeilingPrices(acao({ receitas_cagr5: 80 }));
    const noTeto = 1.2 / (0.12 - CEILING_CONSTANTS.GROWTH_CAP);
    expect(gordon_teto).toBeCloseTo(noTeto, 4);
  });

  it('trata crescimento negativo como zero', () => {
    const encolhendo = computeCeilingPrices(acao({ receitas_cagr5: -30 }));
    const parada = computeCeilingPrices(acao({ receitas_cagr5: 0 }));
    expect(encolhendo.gordon_teto).toBeCloseTo(parada.gordon_teto, 5);
  });

  it('não devolve teto para empresa que não paga dividendo', () => {
    // Zero faria a empresa parecer infinitamente cara em vez de fora do modelo.
    expect(computeCeilingPrices(acao({ dy: 0 }))).toEqual({});
    expect(computeCeilingPrices(acao({ dy: null }))).toEqual({});
  });

  it('não devolve teto sem preço', () => {
    expect(computeCeilingPrices(acao({ price: 0 }))).toEqual({});
  });

  it('tolera a ausência do ativo', () => {
    expect(computeCeilingPrices(null)).toEqual({});
    expect(computeCeilingPrices(undefined)).toEqual({});
  });

  it('funciona sem CAGR, tratando o crescimento como zero', () => {
    const { gordon_teto } = computeCeilingPrices(
      acao({ receitas_cagr5: null })
    );
    expect(gordon_teto).toBeCloseTo(1.2 / 0.12, 4);
  });
});
