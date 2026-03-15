import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import Download from "@mui/icons-material/Download";
import Save from "@mui/icons-material/Save";
import InfoIcon from "@mui/icons-material/Info";
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
  const navigate = useNavigate();
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
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState(null);
  const [labelFilter, setLabelFilter] = useState(null);
  const searchTimeout = useRef(null);

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
        search,
      });
      setLista(result.data);
      setRowCount(result.pagination.total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters, search]);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(value);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 400);
  };

  const handleChip = (chipName) => {
    if (activeChip === chipName) {
      setActiveChip(null);
      setColumnFilters([]);
      setSorting([]);
      setLabelFilter(null);
    } else {
      setActiveChip(chipName);
      setColumnFilters([]);
      setSorting([]);
      setLabelFilter(null);
      if (chipName === "barata") {
        setLabelFilter("BARATA");
      } else if (chipName === "dy") {
        setColumnFilters([{ id: "dy", value: [8, ""] }]);
      } else if (chipName === "magic") {
        setSorting([{ id: "magic_formula_rank", desc: false }]);
      }
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  };

  const displayData = useMemo(
    () => (labelFilter ? lista.filter((s) => s.ml_label === labelFilter) : lista),
    [lista, labelFilter]
  );

  const table = useMaterialReactTable({
    columns,
    data: displayData,
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
      "mrt-row-actions": { size: 90, grow: false },
    },
    initialState: {
      density: savedState.density || "compact",
      columnVisibility: savedState.columnVisibility || DEFAULT_COLUMN_VISIBILITY,
      columnOrder: savedState.columnOrder || [],
      columnSizing: savedState.columnSizing || {},
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        <Tooltip title="Ver detalhes">
          <IconButton onClick={() => navigate(`/acao/${row.original.ticker}`)}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
        <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            placeholder="Buscar por ticker ou empresa..."
            size="small"
            value={inputValue}
            onChange={handleSearchChange}
            sx={{ minWidth: 250 }}
          />
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
        <Box sx={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Chip
            label="BARATA"
            color={activeChip === "barata" ? "success" : "default"}
            variant={activeChip === "barata" ? "filled" : "outlined"}
            onClick={() => handleChip("barata")}
            size="small"
          />
          <Chip
            label="DY > 8%"
            color={activeChip === "dy" ? "primary" : "default"}
            variant={activeChip === "dy" ? "filled" : "outlined"}
            onClick={() => handleChip("dy")}
            size="small"
          />
          <Chip
            label="Top Magic Formula"
            color={activeChip === "magic" ? "primary" : "default"}
            variant={activeChip === "magic" ? "filled" : "outlined"}
            onClick={() => handleChip("magic")}
            size="small"
          />
          {(activeChip || search) && (
            <Chip
              label="Limpar filtros"
              color="error"
              variant="outlined"
              onClick={() => {
                setActiveChip(null);
                setColumnFilters([]);
                setSorting([]);
                setLabelFilter(null);
                setInputValue("");
                setSearch("");
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              size="small"
            />
          )}
        </Box>
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
