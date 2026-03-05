import React, { useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import Download from "@mui/icons-material/Download";
import Save from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { darken } from "@mui/material";
import FIIService from "../services/fii.service";
import AuthService from "../services/auth.service";
import UserLayoutService from "../services/userLayout.service";
import { collectTableState } from "../utils/tableLayout";

const columns = [
  {
    id: "ticker",
    accessorKey: "ticker",
    header: "Ticker",
    size: 80,
    filterVariant: "autocomplete",
    enableColumnActions: false,
  },
  {
    accessorKey: "companyname",
    header: "Nome",
    size: 120,
    filterVariant: "autocomplete",
    enableColumnActions: false,
  },
  {
    accessorKey: "sectorname",
    header: "Setor",
    size: 120,
    filterVariant: "autocomplete",
    enableColumnActions: false,
  },
  {
    accessorKey: "subsectorname",
    header: "Subsetor",
    size: 120,
    filterVariant: "autocomplete",
    enableColumnActions: false,
  },
  {
    accessorKey: "segment",
    header: "Segmento",
    size: 120,
    filterVariant: "autocomplete",
    enableColumnActions: false,
  },
  {
    accessorKey: "price",
    header: "Preço",
    size: 120,
    filterVariant: "range",
    enableColumnActions: false,
    Cell: ({ cell }) =>
      cell.getValue()?.toLocaleString?.("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
  },
  {
    accessorKey: "dy",
    header: "DY",
    size: 120,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "p_vp",
    header: "P/VP",
    size: 120,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "valorpatrimonialcota",
    header: "Valor Patrimonial Cota",
    size: 180,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "liquidezmediadiaria",
    header: "Liquidez Média Diária",
    size: 180,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "percentualcaixa",
    header: "% Caixa",
    size: 120,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "dividend_cagr",
    header: "Dividend CAGR",
    size: 150,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "cota_cagr",
    header: "Cota CAGR",
    size: 150,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "numerocotistas",
    header: "Número Cotistas",
    size: 150,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "numerocotas",
    header: "Número Cotas",
    size: 150,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "patrimonio",
    header: "Patrimônio",
    size: 120,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "lastdividend",
    header: "Último Dividendo",
    size: 150,
    filterVariant: "range",
    enableColumnActions: false,
  },
];

const defaultColumnState = [
  { id: "ticker", width: 120, sort: "asc" },
  { accessorKey: "price", width: 120 },
  { accessorKey: "dy", width: 120 },
  { accessorKey: "p_vp", width: 120 },
  { accessorKey: "valorpatrimonialcota", width: 180 },
  { accessorKey: "liquidezmediadiaria", width: 180 },
  { accessorKey: "percentualcaixa", width: 120 },
  { accessorKey: "dividend_cagr", width: 150 },
  { accessorKey: "cota_cagr", width: 150 },
  { accessorKey: "numerocotistas", width: 150 },
  { accessorKey: "numerocotas", width: 150 },
  { accessorKey: "patrimonio", width: 120 },
  { accessorKey: "lastdividend", width: 150 },
];

const csvConfig = mkConfig({
  fieldSeparator: ";",
  quoteStrings: '"',
  decimalSeparator: ",",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: true,
});

function ListaFIIs() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const isAdmin = AuthService.isAdmin();

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

      setLista((prevLista) =>
        prevLista.map((item) =>
          item.ticker === ticker ? { ...item, favorita: !favorita } : item
        )
      );

      setLoading(false);
      setSnackbar({
        children: "Favorita removida/adicionada com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.log(error);

      setLoading(false);
      setSnackbar({
        children: "Erro ao remover/adicionar favorita!",
        severity: "error",
      });
    }
  };

  const handleUpdateFIIs = async () => {
    setLoading(true);

    try {
      await FIIService.updateFIIs();
      setLoading(false);

      const updatedFIIs = await FIIService.getAllFIIs();
      setLista(updatedFIIs);
      setSnackbar({
        children: "Fiis atualizados com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating FIIs:", error);
      setLoading(false);
      setSnackbar({
        children: "Erro ao atualizar os FIIs!",
        severity: "error",
      });
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

  const table = useMaterialReactTable({
    columns,
    data: lista,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enableRowActions: true,
    columnFilterDisplayMode: "popover",
    layoutMode: "grid",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 40,
        grow: false,
      },
    },
    initialState: JSON.parse(sessionStorage.getItem("stateListaFiis")) || {
      density: "compact",
      pagination: {
        pageSize: 15,
      },
      defaultColumnState,
      columnVisibility: {
        sectorname: false,
        subsectorname: false,
        segment: false,
        dividend_cagr: false,
        cota_cagr: false,
        numerocotistas: false,
        numerocotas: false,
        patrimonio: false,
        percentualcaixa: false,
      },
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        <IconButton
          color="secondary"
          onClick={() => {
            handleFavoritar(row.original.favorita, row.original.ticker);
          }}
        >
          {row.original.favorita ? (
            <Tooltip title="Remover favorita">
              <Star />
            </Tooltip>
          ) : (
            <Tooltip title="Adicionar favorita">
              <StarBorder />
            </Tooltip>
          )}
        </IconButton>
      </Box>
    ),
    localization: MRT_Localization_PT_BR,
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}>
        <Button
          color="primary"
          onClick={handleExportData}
          startIcon={<Download />}
          variant="contained"
        >
          Exportar
        </Button>
        <Button
          color="primary"
          onClick={saveLayout}
          startIcon={<Save />}
          variant="contained"
        >
          Salvar layout
        </Button>
        {isAdmin && (
          <Button
            color="secondary"
            onClick={handleUpdateFIIs}
            variant="contained"
          >
            Atualizar FIIs
          </Button>
        )}
      </Box>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        "& tr:nth-of-type(odd)": {
          backgroundColor: darken(theme.palette.background.default, 0.1),
        },
      }),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await FIIService.getAllFIIs();
        setLista(data);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      <MaterialReactTable table={table} />

      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
}

export default ListaFIIs;
