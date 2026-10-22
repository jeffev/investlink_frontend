import ScoreChip from '../components/ScoreChip';
import { numericColumn } from './cells';

export function getFiiColumns(prefix = '', readonly = false) {
  const p = prefix ? `${prefix}.` : '';

  const cols = [
    {
      id: `${p}ticker`,
      accessorKey: `${p}ticker`,
      header: 'Ticker',
      size: 80,
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
      accessorKey: `${p}segment`,
      header: 'Segmento',
      size: 120,
      filterVariant: 'text',
      enableColumnActions: false,
    },
    {
      id: `${p}score_total`,
      accessorKey: `${p}score_total`,
      header: 'Score',
      size: 90,
      enableColumnActions: false,
      // Ordenável no servidor: a listagem faz join com fii_scores. Oferecer a
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
    numericColumn({
      accessorKey: `${p}price`,
      header: 'Cota',
      kind: 'currency',
      size: 110,
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
      accessorKey: `${p}valorpatrimonialcota`,
      header: 'Valor patrimonial/cota',
      kind: 'currency',
      size: 170,
    }),
    numericColumn({
      accessorKey: `${p}liquidezmediadiaria`,
      header: 'Liquidez diária',
      kind: 'compact',
      size: 130,
    }),
    numericColumn({
      accessorKey: `${p}percentualcaixa`,
      header: '% em caixa',
      kind: 'percent',
      size: 110,
    }),
    numericColumn({
      accessorKey: `${p}dividend_cagr`,
      header: 'CAGR dividendo',
      kind: 'percent',
      size: 140,
    }),
    numericColumn({
      accessorKey: `${p}cota_cagr`,
      header: 'CAGR cota',
      kind: 'percent',
      size: 120,
    }),
    numericColumn({
      accessorKey: `${p}numerocotistas`,
      header: 'Cotistas',
      kind: 'integer',
      size: 110,
    }),
    numericColumn({
      accessorKey: `${p}numerocotas`,
      header: 'Cotas emitidas',
      kind: 'integer',
      size: 140,
    }),
    numericColumn({
      accessorKey: `${p}patrimonio`,
      header: 'Patrimônio',
      kind: 'compact',
      size: 130,
    }),
    numericColumn({
      accessorKey: `${p}lastdividend`,
      header: 'Último rendimento',
      kind: 'currency',
      size: 150,
    }),
  ];

  if (readonly) {
    return cols.map((col) => ({ ...col, Edit: () => null, enableEditing: false }));
  }
  return cols;
}
