import React from 'react';
import { Box, CircularProgress, Tooltip, Typography } from '@mui/material';

import { scoreBand } from '../utils/score';

/**
 * O score em tamanho de destaque, para o card da vitrine.
 *
 * No card antigo a nota era um chip de 22px no canto — o dado mais importante
 * da tela era o menos visível dela. Aqui ela é um anel preenchido: o número
 * continua legível e o arco dá a escala que o número sozinho não dá, porque
 * "69" só quer dizer alguma coisa contra um máximo de 100.
 *
 * O `ScoreChip` continua existindo para a tabela densa, onde cabe um chip e
 * não cabe um anel. Os dois leem a mesma faixa em `utils/score`.
 */
function ScoreMeter({ score, size = 56 }) {
  const band = scoreBand(score);
  const empty = score == null;

  return (
    <Tooltip
      title={
        empty
          ? 'Sem nota neste perfil'
          : `${band.label} — o score é o percentil do ativo contra os pares do próprio setor`
      }
    >
      <Box
        sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}
        aria-label={empty ? 'Sem nota' : `Score ${score} de 100, ${band.label}`}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={4}
          sx={{ color: 'divider' }}
        />
        <CircularProgress
          variant="determinate"
          value={empty ? 0 : Math.min(score, 100)}
          size={size}
          thickness={4}
          color={empty ? 'inherit' : band.color}
          sx={{ position: 'absolute', left: 0, strokeLinecap: 'round' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            lineHeight={1}
            color={empty ? 'text.disabled' : 'text.primary'}
          >
            {empty ? '—' : Math.round(score)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.5625rem', lineHeight: 1.2 }}
          >
            {empty ? '' : '/100'}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}

export default ScoreMeter;
