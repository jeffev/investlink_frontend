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
      accessorKey: `${p}dy`,
      header: 'DY',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}p_vp`,
      header: 'P/VP',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}valorpatrimonialcota`,
      header: 'Valor Patrimonial Cota',
      size: 180,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}liquidezmediadiaria`,
      header: 'Liquidez Média Diária',
      size: 180,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}percentualcaixa`,
      header: '% Caixa',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}dividend_cagr`,
      header: 'Dividend CAGR',
      size: 150,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}cota_cagr`,
      header: 'Cota CAGR',
      size: 150,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}numerocotistas`,
      header: 'Número Cotistas',
      size: 150,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}numerocotas`,
      header: 'Número Cotas',
      size: 150,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}patrimonio`,
      header: 'Patrimônio',
      size: 120,
      filterVariant: 'range',
      enableColumnActions: false,
    },
    {
      accessorKey: `${p}lastdividend`,
      header: 'Último Dividendo',
      size: 150,
      filterVariant: 'range',
      enableColumnActions: false,
    },
  ];

  if (readonly) {
    return cols.map((col) => ({ ...col, Edit: () => null, enableEditing: false }));
  }
  return cols;
}
