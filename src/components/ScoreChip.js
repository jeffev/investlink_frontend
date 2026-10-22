import React, { useState } from 'react';
import { Chip, Popover } from '@mui/material';

import ScoreBreakdown from './ScoreBreakdown';
import { scoreColor } from '../utils/score';

/**
 * A nota em tamanho de tabela.
 *
 * Fica nas listas densas, nas favoritas e no comparador, onde cabe um chip e
 * não cabe o anel do card. Clicar abre a decomposição: nota que ninguém
 * consegue abrir é número que ninguém confia.
 *
 * A régua das faixas e o conteúdo da decomposição vivem fora daqui, em
 * `utils/score` e `ScoreBreakdown`, para o anel da vitrine dizer exatamente a
 * mesma coisa.
 */

const LABEL_COLORS = {
  BARATA: 'success',
  NEUTRA: 'warning',
  CARA: 'error',
};

export default function ScoreChip({
  score,
  label,
  probabilities,
  pillars = [],
  size = 'small',
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  if (score == null && !label) return <span>—</span>;

  return (
    <>
      <Chip
        label={score != null ? score.toFixed(0) : label}
        size={size}
        color={score != null ? scoreColor(score) : LABEL_COLORS[label]}
        variant="outlined"
        onClick={(event) => {
          // O chip fica dentro de linhas e cards clicáveis.
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        }}
        sx={{ fontWeight: 700, cursor: 'pointer' }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onClick={(event) => event.stopPropagation()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{ paper: { sx: { p: 2 } } }}
      >
        <ScoreBreakdown
          score={score}
          label={label}
          pillars={pillars}
          probabilities={probabilities}
        />
      </Popover>
    </>
  );
}
