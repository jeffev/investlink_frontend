import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Download from '@mui/icons-material/Download';
import Save from '@mui/icons-material/Save';

function TableToolbar({
  inputValue,
  onSearchChange,
  search,
  activeChip,
  onChip,
  onClear,
  onExport,
  onSaveLayout,
  isAdmin,
  onAdminUpdate,
  adminLabel,
  chips,
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar por ticker ou empresa..."
          size="small"
          value={inputValue}
          onChange={onSearchChange}
          sx={{ minWidth: 250 }}
        />
        <Button color="primary" onClick={onExport} startIcon={<Download />} variant="contained">
          Exportar
        </Button>
        <Button color="primary" onClick={onSaveLayout} startIcon={<Save />} variant="contained">
          Salvar layout
        </Button>
        {isAdmin && (
          <Button color="secondary" onClick={onAdminUpdate} variant="contained">
            {adminLabel}
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {chips.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.label}
            color={activeChip === chip.id ? chip.color : 'default'}
            variant={activeChip === chip.id ? 'filled' : 'outlined'}
            onClick={() => onChip(chip.id)}
            size="small"
          />
        ))}
        {(activeChip || search) && (
          <Chip
            label="Limpar filtros"
            color="error"
            variant="outlined"
            onClick={onClear}
            size="small"
          />
        )}
      </Box>
    </Box>
  );
}

export default TableToolbar;
