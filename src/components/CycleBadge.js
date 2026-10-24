import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { formatPercent } from '../utils/formatters';

/**
 * Onde o ativo está no próprio ciclo.
 *
 * O score responde "é bom?" comparando com os pares do setor. Esta tarja
 * responde **"é hora?"** — e sem ela a mesma ação no topo histórico e 40%
 * abaixo do pico apareciam idênticas no card.
 *
 * Os três estados não são graus da mesma coisa:
 *
 *   Oportunidade  caiu e o fundamento ficou de pé
 *   Topo          colado na máxima de 12 meses, que é o pior ponto de entrada
 *   Deterioração  caiu e o lucro caiu junto — armadilha, não desconto
 *
 * O terceiro existe porque queda grande, sozinha, seleciona ativo quebrado.
 * Foi o que aconteceu na primeira execução real do score de FII: o topo dos
 * três perfis eram os quatro fundos de crédito mais descontados da bolsa.
 */

const ESTADOS = {
  OPORTUNIDADE_DE_CICLO: {
    color: 'success',
    icon: <TrendingDownIcon sx={{ fontSize: 15 }} />,
    label: (queda) => `Caiu ${formatPercent(Math.abs(queda), { digits: 0 })} do topo`,
    fallback: 'Queda com fundamento de pé',
  },
  PERTO_DO_TOPO: {
    color: 'warning',
    icon: <TrendingUpIcon sx={{ fontSize: 15 }} />,
    label: () => 'No topo de 12 meses',
  },
  QUEDA_COM_DETERIORACAO: {
    color: 'error',
    icon: <WarningAmberIcon sx={{ fontSize: 15 }} />,
    label: () => 'Queda com deterioração',
  },
};

function CycleBadge({ state, drawdown, message, size = 'small' }) {
  const estado = ESTADOS[state];
  // NEUTRO e ausência de histórico não viram tarja: uma etiqueta para dizer
  // que não há nada a dizer só ocupa espaço no card.
  if (!estado) return null;

  const texto =
    drawdown != null ? estado.label(drawdown) : estado.fallback ?? estado.label(0);

  return (
    <Tooltip title={message || ''}>
      <Chip
        icon={estado.icon}
        label={texto}
        color={estado.color}
        size={size}
        variant="outlined"
        sx={{ fontWeight: 600 }}
      />
    </Tooltip>
  );
}

export default CycleBadge;
