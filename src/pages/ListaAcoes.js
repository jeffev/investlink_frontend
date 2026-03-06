import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import Download from "@mui/icons-material/Download";
import Save from "@mui/icons-material/Save";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { darken } from "@mui/material";

import StockService from "../services/stock.service";
import AuthService from "../services/auth.service";
import UserLayoutService from "../services/userLayout.service";
import { collectTableState } from "../utils/tableLayout";
import { getStockColumns } from "../columns/stockColumns";
import { LoadingBackdrop, FeedbackSnackbar } from "../components/Common/FeedbackUI";

const csvConfig = mkConfig({
  fieldSeparator: ";",
  quoteStrings: '"',
  decimalSeparator: ",",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: true,
});

const savedState = JSON.parse(sessionStorage.getItem("stateListaAcoes")) || {};

const DEFAULT_COLUMN_VISIBILITY = {
  vpa: false,
  lpa: false,
  companyname: false,
  p_ebit: false,
  p_ativo: false,
  ev_ebit: false,
  margembruta: false,
  margemebit: false,
  margemliquida: false,
  p_capitalgiro: false,
  p_ativocirculante: false,
  giroativos: false,
  dividaliquidapatrimonioliquido: false,
  dividaliquidaebit: false,
  pl_ativo: false,
  passivo_ativo: false,
  liquidezcorrente: false,
  peg_ratio: false,
  receitas_cagr5: false,
  valormercado: false,
  subsectorname: false,
  segmentname: false,
  sectorname: false,
  graham_formula: false,
  roic_rank: false,
  ey_rank: false,
};

function ListaAcoes() {
  const [lista, setLista] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [pagination, setPagination] = useState(
    savedState.pagination || { pageIndex: 0, pageSize: 15 }
  );
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const handleCloseSnackbar = () => setSnackbar(null);
  const isAdmin = AuthService.isAdmin();
  const columns = useMemo(() => getStockColumns(""), []);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await StockService.getAllStocks({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sorting,
        columnFilters,
      });
      setLista(result.data);
      setRowCount(result.pagination.total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(lista);
    download(csvConfig)(csv);
  };

  const handleFavoritar = async (favorita, ticker) => {
    setLoading(true);
    try {
      if (favorita) {
        await StockService.removeFavorite(ticker);
      } else {
        await StockService.addFavorite(ticker);
      }
      setLista((prev) =>
        prev.map((item) =>
          item.ticker === ticker ? { ...item, favorita: !favorita } : item
        )
      );
      setSnackbar({ children: "Favorita removida/adicionada com sucesso!", severity: "success" });
    } catch (error) {
      console.error(error);
      setSnackbar({ children: "Erro ao remover/adicionar favorita!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStocks = async () => {
    setLoading(true);
    try {
      await StockService.updateStocks();
      await fetchData();
      setSnackbar({ children: "Ações atualizadas com sucesso!", severity: "success" });
    } catch (error) {
      console.error("Error updating stocks:", error);
      setSnackbar({ children: "Erro ao atualizar as ações!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const saveLayout = async () => {
    const tableState = collectTableState(table);
    if (!tableState) return;
    const json = JSON.stringify(tableState);
    sessionStorage.setItem("stateListaAcoes", json);
    setLoading(true);
    try {
      await UserLayoutService.saveLayout("ListaAcoes", json);
      setSnackbar({ children: "Layout salvo com sucesso!", severity: "success" });
    } catch (error) {
      console.error("Erro ao salvar o layout:", error);
      setSnackbar({ children: "Erro ao salvar layout!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: lista,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      pagination,
      sorting,
      columnFilters,
      isLoading: isFetching,
    },
    enableColumnFilterModes: false,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enableRowActions: true,
    columnFilterDisplayMode: "popover",
    layoutMode: "grid",
    displayColumnDefOptions: {
      "mrt-row-actions": { size: 40, grow: false },
    },
    initialState: {
      density: savedState.density || "compact",
      columnVisibility: savedState.columnVisibility || DEFAULT_COLUMN_VISIBILITY,
      columnOrder: savedState.columnOrder || [],
      columnSizing: savedState.columnSizing || {},
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        <IconButton
          color="secondary"
          onClick={() => handleFavoritar(row.original.favorita, row.original.ticker)}
        >
          {row.original.favorita ? (
            <Tooltip title="Remover favorita"><Star /></Tooltip>
          ) : (
            <Tooltip title="Adicionar favorita"><StarBorder /></Tooltip>
          )}
        </IconButton>
      </Box>
    ),
    localization: MRT_Localization_PT_BR,
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}>
        <Button color="primary" onClick={handleExportData} startIcon={<Download />} variant="contained">
          Exportar
        </Button>
        <Button color="primary" onClick={saveLayout} startIcon={<Save />} variant="contained">
          Salvar layout
        </Button>
        {isAdmin && (
          <Button color="secondary" onClick={handleUpdateStocks} variant="contained">
            Atualizar Ações
          </Button>
        )}
      </Box>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: "0" },
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        "& tr:nth-of-type(odd)": {
          backgroundColor: darken(theme.palette.background.default, 0.1),
        },
      }),
    },
  });

  return (
    <div>
      <LoadingBackdrop open={loading} />
      <MaterialReactTable table={table} />
      <FeedbackSnackbar snackbar={snackbar} onClose={handleCloseSnackbar} />
    </div>
  );
}

export default ListaAcoes;
