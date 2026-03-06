import { Box, Chip, Tooltip, alpha } from '@mui/material';

export function getStockColumns(prefix = '', readonly = false) {
  const p = prefix ? `${prefix}.` : '';

  const cols = [
    {
      id: `${p}ticker`,
      accessorKey: `${p}ticker`,
      header: 'Ticker',
      size: 120,
      filterVariant: 'text',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}companyname`,
      header: 'Nome',
      size: 120,
      filterVariant: 'text',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}sectorname`,
      header: 'Setor',
      size: 120,
      filterVariant: 'text',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}subsectorname`,
      header: 'Subsetor',
      size: 120,
      filterVariant: 'text',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}segmentname`,
      header: 'Segmento',
      size: 120,
      filterVariant: 'text',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}price`,
      header: 'Preço',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
      Cell: ({ cell }) =>
        cell.getValue()?.toLocaleString?.('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      accessorKey: `${p}roe`,
      header: 'Roe',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}roa`,
      header: 'ROA',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}roic`,
      header: 'ROIC',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}dy`,
      header: 'DY',
      size: 100,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}p_vp`,
      header: 'PVP',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}vpa`,
      header: 'VPA',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}lpa`,
      header: 'LPA',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}p_l`,
      header: 'PL',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}p_ebit`,
      header: 'P/EBIT',
      size: 100,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}p_ativo`,
      header: 'P/Ativo',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}ev_ebit`,
      header: 'EV/EBIT',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}margembruta`,
      header: 'Margem Bruta',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}margemebit`,
      header: 'Margem Ebit',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}margemliquida`,
      header: 'Margem Líquida',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}p_capitalgiro`,
      header: 'Capital de giro',
      size: 100,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}p_ativocirculante`,
      header: 'Ativo circulante',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}giroativos`,
      header: 'Giro de ativo',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}dividaliquidapatrimonioliquido`,
      header: 'Dívida líquida/patrimônio líquido',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}dividaliquidaebit`,
      header: 'Dívida líquida/EBITDA',
      size: 100,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}pl_ativo`,
      header: 'PL/Ativo',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}passivo_ativo`,
      header: 'Ativo/Passivo',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}liquidezcorrente`,
      header: 'Liquidez Corrente',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}peg_ratio`,
      header: 'PEG ratio',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}receitas_cagr5`,
      header: 'CAGR Receitas 5 anos',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}valormercado`,
      header: 'Valor Mercado',
      size: 100,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}graham_formula`,
      header: 'Fórmula Graham',
      size: 150,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}discount_to_graham`,
      header: 'Desconto Fórmula Graham',
      size: 130,
      filterVariant: 'range',
      enableColumnActions: false,
      Cell: ({ cell }) => (
        <Box
          component="span"
          sx={(theme) => ({
            backgroundColor:
              cell.getValue() < 0
                ? theme.palette.success.light
                : cell.getValue() >= 0 && cell.getValue() < 30
                ? theme.palette.warning.light
                : theme.palette.error.light,
            borderRadius: '0.25rem',
            color: '#fff',
            maxWidth: '9ch',
            p: '0.25rem',
          })}
        >
          {cell.getValue()?.toLocaleString?.('pt-BR')}
        </Box>
      ),
    },
    {
      accessorKey: `${p}roic_rank`,
      header: 'Rank roic',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}ey_rank`,
      header: 'Earnings rank',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}magic_formula_rank`,
      header: 'Rank fórmula mágica',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      id: `${p}analise_ml`,
      accessorKey: `${p}ml_label`,
      header: 'Análise ML',
      size: 120,
      enableColumnActions: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const original = row.original;
        const ml_label = prefix ? original[prefix]?.ml_label : original.ml_label;
        const ml_prob_barata = prefix ? original[prefix]?.ml_prob_barata : original.ml_prob_barata;
        const ml_prob_neutra = prefix ? original[prefix]?.ml_prob_neutra : original.ml_prob_neutra;
        const ml_prob_cara = prefix ? original[prefix]?.ml_prob_cara : original.ml_prob_cara;

        if (!ml_label) return null;

        const paletteMap = { BARATA: 'success', NEUTRA: 'primary', CARA: 'error' };
        const toPercent = (v) => `${Math.round((v ?? 0) * 100)}%`;
        const tooltipText = `Barata: ${toPercent(ml_prob_barata)} | Neutra: ${toPercent(ml_prob_neutra)} | Cara: ${toPercent(ml_prob_cara)}`;

        return (
          <Tooltip title={tooltipText}>
            <Chip
              label={ml_label}
              size="small"
              sx={(theme) => {
                const key = paletteMap[ml_label];
                const base = key ? theme.palette[key].main : theme.palette.grey[500];
                return {
                  backgroundColor: alpha(base, 0.12),
                  color: base,
                  border: `1px solid ${alpha(base, 0.35)}`,
                  fontWeight: 600,
                };
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      id: `${p}composite_score`,
      accessorKey: `${p}ml_score`,
      header: 'Score',
      size: 80,
      enableColumnActions: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const original = row.original;
        return prefix ? (original[prefix]?.ml_score ?? null) : (original.ml_score ?? null);
      },
    },
  ];

  if (readonly) {
    return cols.map((col) => ({ ...col, Edit: () => null, enableEditing: false }));
  }
  return cols;
}
