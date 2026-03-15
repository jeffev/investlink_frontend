import React from 'react';
import Box from '@mui/material/Box';

function PriceCell({ price, currentPrice }) {
  const isActive = price != null && price > currentPrice;
  return (
    <Box
      component="span"
      sx={{
        color: isActive ? 'success.main' : 'inherit',
        fontWeight: isActive ? 'bold' : 'normal',
      }}
    >
      {price?.toLocaleString?.('pt-BR', { style: 'currency', currency: 'BRL' })}
    </Box>
  );
}

export default PriceCell;
