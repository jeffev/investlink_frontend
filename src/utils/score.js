/**
 * As faixas do score, em um lugar só.
 *
 * O número sozinho não diz nada: 69 é bom? O score é um **percentil contra os
 * pares do próprio setor ou segmento**, então 69 quer dizer "melhor que 69%
 * dos vizinhos". A faixa traduz isso para quem não vai ler a documentação.
 *
 * A escala vivia duplicada dentro do `ScoreChip`; qualquer segundo lugar que
 * mostrasse o score ia inventar a própria régua.
 */

export const SCORE_BANDS = [
  {
    min: 80,
    key: 'forte',
    label: 'Muito acima dos pares',
    short: 'Forte',
    color: 'success',
  },
  {
    min: 60,
    key: 'bom',
    label: 'Acima da média dos pares',
    short: 'Bom',
    color: 'success',
  },
  {
    min: 40,
    key: 'medio',
    label: 'Na média dos pares',
    short: 'Médio',
    color: 'warning',
  },
  {
    min: 0,
    key: 'fraco',
    label: 'Abaixo da média dos pares',
    short: 'Fraco',
    color: 'error',
  },
];

export function scoreBand(score) {
  if (score == null) return null;
  return SCORE_BANDS.find((band) => score >= band.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

export function scoreColor(score) {
  return scoreBand(score)?.color ?? 'default';
}

export function scoreLabel(score) {
  return scoreBand(score)?.label ?? 'Sem nota';
}
