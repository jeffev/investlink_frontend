/**
 * Preços teto por Bazin e por Gordon.
 *
 * Estava embutido na página de detalhe, sem teste, apesar de ser a única
 * conta de valuation que o frontend faz por si — o resto vem pronto do
 * backend.
 *
 * **Bazin**: o preço que faria o dividendo atual render 6% ao ano. É uma régua
 * de renda, não de valor: só faz sentido para empresa que paga dividendo
 * recorrente, e por isso a função devolve vazio sem DY.
 *
 * **Gordon**: dividendo dividido por (retorno exigido − crescimento). Sensível
 * ao ponto de explodir quando o crescimento se aproxima do retorno exigido,
 * então o crescimento é limitado — ver GROWTH_CAP.
 */

// Retorno que Décio Bazin considerava o mínimo aceitável para viver de renda.
const BAZIN_YIELD = 0.06;

// Retorno exigido no modelo de Gordon.
const REQUIRED_RETURN = 0.12;

// Teto do crescimento perpétuo. Sem ele, uma empresa com CAGR de 11% chegaria
// perto do retorno exigido e o denominador levaria o preço teto ao infinito —
// nenhuma empresa cresce 12% ao ano para sempre.
const GROWTH_CAP = 0.1;

function discountToCeiling(ceiling, price) {
  if (!ceiling || ceiling <= 0) return null;
  return ((ceiling - price) / ceiling) * 100;
}

export function computeCeilingPrices(stock) {
  const price = stock?.price;
  const dividendYield = stock?.dy;
  const revenueGrowth = stock?.receitas_cagr5;

  // Sem dividendo não existe preço teto por renda — e devolver zero faria uma
  // empresa que não paga parecer infinitamente cara.
  if (!price || !dividendYield || dividendYield <= 0) return {};

  const annualDividend = price * (dividendYield / 100);
  const bazinCeiling = annualDividend / BAZIN_YIELD;

  const growth =
    revenueGrowth != null
      ? Math.min(Math.max(revenueGrowth / 100, 0), GROWTH_CAP)
      : 0;

  let gordonCeiling = null;
  if (REQUIRED_RETURN > growth) {
    gordonCeiling = annualDividend / (REQUIRED_RETURN - growth);
  }

  return {
    bazin_teto: bazinCeiling,
    bazin_discount: discountToCeiling(bazinCeiling, price),
    gordon_teto: gordonCeiling,
    gordon_discount: discountToCeiling(gordonCeiling, price),
  };
}

export const CEILING_CONSTANTS = { BAZIN_YIELD, REQUIRED_RETURN, GROWTH_CAP };
