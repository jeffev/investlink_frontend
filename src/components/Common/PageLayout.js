import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

/**
 * A largura e o cabeçalho de todas as páginas.
 *
 * Cada tela definia o próprio `maxWidth: 1200` e o próprio `py: 3`, então
 * nenhuma começava na mesma altura nem terminava na mesma margem. Pior: num
 * monitor de 3440px o conteúdo ficava numa coluna de 1200 no meio, com um
 * terço da tela usado e o resto preto.
 *
 * `wide` cresce com a tela para o que é grade ou tabela; `narrow` mantém a
 * medida de leitura confortável para texto corrido, que não melhora ficando
 * mais largo.
 */

const WIDTHS = {
  narrow: 880,
  default: 1280,
  wide: 1800,
  full: '100%',
};

export function PageContainer({ width = 'default', children, sx = {} }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: WIDTHS[width] ?? WIDTHS.default,
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 2, md: 4 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function PageHeader({ title, description, actions, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" component="h1">
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, maxWidth: 720 }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
      </Stack>
      {children}
    </Box>
  );
}

/**
 * Grade que preenche a tela em vez de parar em três colunas.
 *
 * O `Grid` do MUI com `lg={4}` trava em três cards por linha para sempre; num
 * monitor largo isso deixa metade da tela vazia enquanto o usuário rola.
 */
export function CardGrid({ minColumnWidth = 320, children, sx = {} }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`,
        gap: 2,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
