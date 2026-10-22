import React from 'react';
import { Box, Divider, LinearProgress, Typography } from '@mui/material';

import { scoreBand, scoreColor } from '../utils/score';

/**
 * A decomposição do score.
 *
 * Extraída de dentro do `ScoreChip` porque passou a ter dois donos: o chip da
 * tabela densa e o anel do card da vitrine. Enquanto vivia só no chip, quem
 * quisesse mostrar o score em outro lugar teria que reescrever a régua — e
 * duas réguas para a mesma nota é como um número deixa de ser confiável.
 */

const LABEL_MEANING = {
  BARATA: 'o modelo projeta desempenho acima do Ibovespa',
  NEUTRA: 'o modelo projeta desempenho em linha com o Ibovespa',
  CARA: 'o modelo projeta desempenho abaixo do Ibovespa',
};

function MeterRow({ label, value, suffix, color }) {
  if (value == null) return null;
  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="caption" fontWeight={600}>
          {suffix}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(value, 100)}
        color={color}
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
  );
}

function ScoreBreakdown({ score, label, pillars = [], probabilities }) {
  const band = scoreBand(score);

  return (
    <Box sx={{ width: 280 }}>
      <Typography variant="subtitle2" fontWeight={700}>
        Score {score != null ? score.toFixed(0) : '—'} / 100
      </Typography>
      {band && (
        <Typography variant="caption" color="text.secondary">
          {band.label}
        </Typography>
      )}

      {label && (
        <Typography variant="caption" color="text.secondary" display="block">
          Classificação <strong>{label}</strong> —{' '}
          {LABEL_MEANING[label] ?? 'sem interpretação disponível'}.
        </Typography>
      )}

      {pillars.length > 0 && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="overline" color="text.secondary">
            Composição
          </Typography>
          <Box sx={{ mt: 1 }}>
            {pillars.map(({ key, label: pillarLabel, value, weight }) => (
              <MeterRow
                key={key}
                label={pillarLabel + (weight != null ? ` · ${weight}%` : '')}
                value={value ?? 0}
                suffix={value != null ? value.toFixed(0) : '—'}
                color={scoreColor(value)}
              />
            ))}
          </Box>
        </>
      )}

      {probabilities && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="overline" color="text.secondary">
            Probabilidades do modelo
          </Typography>
          <Box sx={{ mt: 1 }}>
            {[
              ['Barata', probabilities.barata, 'success'],
              ['Neutra', probabilities.neutra, 'warning'],
              ['Cara', probabilities.cara, 'error'],
            ].map(([rowLabel, value, color]) =>
              value == null ? null : (
                <MeterRow
                  key={rowLabel}
                  label={rowLabel}
                  value={value * 100}
                  suffix={`${(value * 100).toFixed(1)}%`}
                  color={color}
                />
              )
            )}
          </Box>
        </>
      )}

      <Divider sx={{ my: 1.5 }} />
      <Typography variant="caption" color="text.secondary">
        O score é o percentil do ativo contra os pares do próprio setor. É ponto
        de partida para a análise, não recomendação.
      </Typography>
    </Box>
  );
}

export default ScoreBreakdown;
