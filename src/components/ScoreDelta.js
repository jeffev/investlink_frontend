import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FiberNewIcon from '@mui/icons-material/FiberNew';

/**
 * O que mudou na nota desde o retrato anterior.
 *
 * Sem isto a vitrine é um catálogo: responde "quais são os melhores agora" e
 * nunca "o que mudou desde a última vez que você olhou" — que é a única razão
 * de abrir o app amanhã de novo.
 *
 * O backend apagava e reescrevia a tabela de score a cada execução; o
 * histórico diário passou a ser gravado à parte justamente para isto.
 */
function ScoreDelta({ delta, isNew, since }) {
  if (isNew) {
    return (
      <Tooltip title={`Não estava na lista em ${since || 'o retrato anterior'}`}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiberNewIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant="caption" color="primary.main" fontWeight={700}>
            Novo
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  // Variação de meio ponto é ruído de arredondamento, não notícia.
  if (delta == null || Math.abs(delta) < 1) return null;

  const subiu = delta > 0;
  return (
    <Tooltip title={`Comparado com ${since || 'o retrato anterior'}`}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {subiu ? (
          <ArrowDropUpIcon sx={{ fontSize: 18, color: 'market.positive' }} />
        ) : (
          <ArrowDropDownIcon sx={{ fontSize: 18, color: 'market.negative' }} />
        )}
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: subiu ? 'market.positive' : 'market.negative' }}
        >
          {Math.abs(delta).toFixed(0)}
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default ScoreDelta;
