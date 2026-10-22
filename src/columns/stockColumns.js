import { Chip, Tooltip, alpha } from '@mui/material';
import ScoreChip from '../components/ScoreChip';
import { FORMATTERS, TrendBadge, numericColumn } from './cells';

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
      accessorKey: `${p}fundamentals_source`,
      header: 'Fonte do Fundamento',
      size: 150,
      filterVariant: 'text',
      enableColumnActions: false,
      // CVM means audited trailing twelve months; StatusInvest means the last
      // closed fiscal year, which in September is nine months old.
      Cell: ({ cell, row }) => {
        const source = cell.getValue();
        if (!source) return '—';
        const isAudited = source === 'CVM';
        const date = prefix
          ? row.original[prefix]?.fundamentals_date
          : row.original.fundamentals_date;
        return (
          <Tooltip
            title={
              isAudited
                ? `Demonstracao auditada da CVM, 12 meses ate ${date || '—'}`
                : 'Ultimo exercicio fechado, conforme o StatusInvest'
            }
          >
            <Chip
              label={isAudited ? 'CVM · 12m' : 'StatusInvest'}
              size="small"
              color={isAudited ? 'success' : 'default'}
              variant="outlined"
            />
          </Tooltip>
        );
      },
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
    numericColumn({
      accessorKey: `${p}price`,
      header: 'Preço',
      kind: 'currency',
      size: 110,
    }),
    {
      accessorKey: `${p}queda_do_topo`,
      header: 'Queda do topo',
      size: 130,
      filterVariant: 'range',
      enableColumnActions: false,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ cell }) => (
        <TrendBadge
          value={cell.getValue()}
          thresholds={(v) =>
            v >= -5 ? 'success' : v >= -15 ? 'warning' : 'error'
          }
        />
      ),
    },
    numericColumn({
      accessorKey: `${p}roe`,
      header: 'ROE',
      kind: 'percent',
      size: 100,
    }),
    numericColumn({
      accessorKey: `${p}roa`,
      header: 'ROA',
      kind: 'percent',
      size: 100,
    }),
    numericColumn({
      accessorKey: `${p}roic`,
      header: 'ROIC',
      kind: 'percent',
      size: 100,
    }),
    numericColumn({
      accessorKey: `${p}dy`,
      header: 'DY',
      kind: 'percent',
      size: 90,
    }),
    numericColumn({
      accessorKey: `${p}p_vp`,
      header: 'P/VP',
      kind: 'ratio',
      size: 90,
    }),
    numericColumn({
      accessorKey: `${p}vpa`,
      header: 'VPA',
      kind: 'currency',
      size: 110,
    }),
    numericColumn({
      accessorKey: `${p}lpa`,
      header: 'LPA',
      kind: 'currency',
      size: 110,
    }),
    numericColumn({
      accessorKey: `${p}p_l`,
      header: 'P/L',
      kind: 'ratio',
      size: 90,
    }),
    numericColumn({
      accessorKey: `${p}p_ebit`,
      header: 'P/EBIT',
      kind: 'ratio',
      size: 100,
    }),
    numericColumn({
      accessorKey: `${p}p_ativo`,
      header: 'P/Ativo',
      kind: 'ratio',
      size: 100,
    }),
    numericColumn({
      accessorKey: `${p}ev_ebit`,
      header: 'EV/EBIT',
      kind: 'ratio',
      size: 100,
    }),
    numericColumn({
      accessorKey: `${p}margembruta`,
      header: 'Margem bruta',
      kind: 'percent',
      size: 120,
    }),
    numericColumn({
      accessorKey: `${p}margemebit`,
      header: 'Margem EBIT',
      kind: 'percent',
      size: 120,
    }),
    numericColumn({
      accessorKey: `${p}margemliquida`,
      header: 'Margem líquida',
      kind: 'percent',
      size: 130,
    }),
    numericColumn({
      accessorKey: `${p}p_capitalgiro`,
      header: 'P/Capital de giro',
      kind: 'ratio',
      size: 140,
    }),
    numericColumn({
      accessorKey: `${p}p_ativocirculante`,
      header: 'P/Ativo circulante',
      kind: 'ratio',
      size: 150,
    }),
    numericColumn({
      accessorKey: `${p}giroativos`,
      header: 'Giro de ativo',
      kind: 'ratio',
      size: 120,
    }),
    numericColumn({
      accessorKey: `${p}dividaliquidapatrimonioliquido`,
      header: 'Dív. líq./PL',
      kind: 'ratio',
      size: 120,
    }),
    numericColumn({
      accessorKey: `${p}dividaliquidaebit`,
      header: 'Dív. líq./EBIT',
      kind: 'ratio',
      size: 130,
    }),
    numericColumn({
      accessorKey: `${p}pl_ativo`,
      header: 'PL/Ativo',
      kind: 'ratio',
      size: 100,
    }),
    numericColumn({
      accessorKey: `${p}passivo_ativo`,
      header: 'Passivo/Ativo',
      kind: 'ratio',
      size: 120,
    }),
    numericColumn({
      accessorKey: `${p}liquidezcorrente`,
      header: 'Liquidez corrente',
      kind: 'ratio',
      size: 140,
    }),
    numericColumn({
      accessorKey: `${p}peg_ratio`,
      header: 'PEG ratio',
      kind: 'ratio',
      size: 110,
    }),
    numericColumn({
      accessorKey: `${p}receitas_cagr5`,
      header: 'CAGR receita 5a',
      kind: 'percent',
      size: 130,
    }),
    numericColumn({
      accessorKey: `${p}valormercado`,
      header: 'Valor de mercado',
      kind: 'compact',
      size: 140,
    }),
    {
      accessorKey: `${p}graham_formula`,
      header: 'Preço-teto de Graham',
      size: 150,
      filterVariant: 'range',
      enableColumnActions: false,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      // Null when the formula does not apply (loss, negative equity):
      // show it as unknown instead of as an empty cell.
      Cell: ({ cell }) => FORMATTERS.currency(cell.getValue()),
    },
    {
      accessorKey: `${p}discount_to_graham`,
      header: 'Desconto vs. Graham',
      size: 150,
      filterVariant: 'range',
      enableColumnActions: false,
      muiTableHeadCellProps: { align: 'right' },
      muiTableBodyCellProps: { align: 'right' },
      Cell: ({ cell }) => (
        <TrendBadge
          value={cell.getValue()}
          thresholds={(v) => (v < 0 ? 'success' : v < 30 ? 'warning' : 'error')}
        />
      ),
    },
    numericColumn({
      accessorKey: `${p}roic_rank`,
      header: 'Rank ROIC',
      kind: 'integer',
      size: 110,
    }),
    numericColumn({
      accessorKey: `${p}ey_rank`,
      header: 'Rank earnings yield',
      kind: 'integer',
      size: 150,
    }),
    numericColumn({
      accessorKey: `${p}magic_formula_rank`,
      header: 'Rank fórmula mágica',
      kind: 'integer',
      size: 160,
    }),
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
      id: `${p}score_total`,
      accessorKey: `${p}score_total`,
      header: 'Score',
      size: 90,
      enableColumnActions: false,
      // Ordenável no servidor: a lista faz join com stock_scores. Oferecer a
      // coluna sem conseguir ordenar por ela seria pior que não oferecer.
      enableSorting: true,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const source = prefix ? row.original[prefix] : row.original;
        if (!source) return '—';
        return (
          <ScoreChip
            score={source.score_total ?? null}
            pillars={source.score_pillars || []}
          />
        );
      },
    },
    {
      id: `${p}composite_score`,
      accessorKey: `${p}ml_score`,
      header: 'Score ML',
      size: 90,
      enableColumnActions: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const source = prefix ? row.original[prefix] : row.original;
        if (!source) return '—';
        return (
          <ScoreChip
            score={source.ml_score ?? null}
            label={source.ml_label ?? null}
            probabilities={{
              barata: source.ml_prob_barata,
              neutra: source.ml_prob_neutra,
              cara: source.ml_prob_cara,
            }}
          />
        );
      },
    },
  ];

  if (readonly) {
    return cols.map((col) => ({ ...col, Edit: () => null, enableEditing: false }));
  }
  return cols;
}
