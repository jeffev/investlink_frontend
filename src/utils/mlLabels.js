/**
 * Cores dos rótulos do modelo de machine learning.
 *
 * Extraído porque a mesma tradução rótulo → cor estava repetida em
 * `AcaoDetalhe` e `Home`, e uma terceira cópia com o mapa incompleto já teria
 * pintado NEUTRA de cinza numa tela e de amarelo na outra.
 */

const LABEL_COLORS = {
  BARATA: "success",
  NEUTRA: "warning",
  CARA: "error",
};

export function getMlChipColor(label) {
  return LABEL_COLORS[label] || "default";
}

export const ML_LABELS = Object.keys(LABEL_COLORS);
