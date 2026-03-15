import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { mkConfig, generateCsv, download } from "export-to-csv";
import { darken } from "@mui/material";

import FIIService from "../services/fii.service";
import AuthService from "../services/auth.service";
import UserLayoutService from "../services/userLayout.service";
import { collectTableState } from "../utils/tableLayout";
import { getFiiColumns } from "../columns/fiiColumns";
import { LoadingBackdrop, FeedbackSnackbar } from "../components/Common/FeedbackUI";

const csvConfig = mkConfig({
  fieldSeparator: ";",
  quoteStrings: '"',
  decimalSeparator: ",",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: true,
});

const savedState = JSON.parse(sessionStorage.getItem("stateListaFiis")) || {};

const DEFAULT_COLUMN_VISIBILITY = {
  sectorname: false,
  subsectorname: false,
  segment: false,
  dividend_cagr: false,
  cota_cagr: false,
  numerocotistas: false,
  numerocotas: false,
  patrimonio: false,
  percentualcaixa: false,
};

function ListaFIIs() {
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
  const searchTimeout = useRef(null);

  const handleCloseSnackbar = () => setSnackbar(null);
  const isAdmin = AuthService.isAdmin();
  const columns = useMemo(() => getFiiColumns(""), []);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await FIIService.getAllFIIs({
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
        await FIIService.removeFavorite(ticker);
      } else {
        await FIIService.addFavorite(ticker);
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

  const handleUpdateFIIs = async () => {
    setLoading(true);
    try {
      await FIIService.updateFIIs();
      await fetchData();
      setSnackbar({ children: "FIIs atualizados com sucesso!", severity: "success" });
    } catch (error) {
      console.error("Error updating FIIs:", error);
      setSnackbar({ children: "Erro ao atualizar os FIIs!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const saveLayout = async () => {
    const tableState = collectTableState(table);
    if (!tableState) return;
    const json = JSON.stringify(tableState);
    sessionStorage.setItem("stateListaFiis", json);
    setLoading(true);
    try {
      await UserLayoutService.saveLayout("ListaFiis", json);
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
    } else {
      setActiveChip(chipName);
      setColumnFilters([]);
      setSorting([]);
      if (chipName === "dy") {
        setColumnFilters([{ id: "dy", value: [8, ""] }]);
      } else if (chipName === "pvp") {
        setColumnFilters([{ id: "p_vp", value: ["", 1] }]);
      } else if (chipName === "liquidez") {
        setSorting([{ id: "liquidezmediadiaria", desc: true }]);
      }
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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
            <Button color="secondary" onClick={handleUpdateFIIs} variant="contained">
              Atualizar FIIs
            </Button>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Chip
            label="DY > 8%"
            color={activeChip === "dy" ? "primary" : "default"}
            variant={activeChip === "dy" ? "filled" : "outlined"}
            onClick={() => handleChip("dy")}
            size="small"
          />
          <Chip
            label="P/VP < 1"
            color={activeChip === "pvp" ? "primary" : "default"}
            variant={activeChip === "pvp" ? "filled" : "outlined"}
            onClick={() => handleChip("pvp")}
            size="small"
          />
          <Chip
            label="Alta Liquidez"
            color={activeChip === "liquidez" ? "primary" : "default"}
            variant={activeChip === "liquidez" ? "filled" : "outlined"}
            onClick={() => handleChip("liquidez")}
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

export default ListaFIIs;
