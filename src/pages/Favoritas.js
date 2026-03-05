import React, { useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Backdrop,
  Box,
  Button,
  Chip,
  Snackbar,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import DeleteIcon from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import StockService from "../services/stock.service";
import Alert from "@mui/material/Alert";

import UserLayoutService from "../services/userLayout.service";
import { collectTableState } from "../utils/tableLayout";

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
    enableEditing: false,
    Edit: () => null,
    enableHiding: false,
  },
  {
    accessorKey: "stock.ticker",
    header: "Ticker",
    size: 80,
    enableEditing: false,
  },
  {
    accessorKey: "ceiling_price",
    header: "Preço Teto",
    muiEditTextFieldProps: {
      type: "number",
    },
    size: 100,
    enableEditing: true,
    filterVariant: "range",
    Cell: ({ cell }) => {
      const currentValue = cell.row.original.stock.price;
      const ceilingPrice = cell.row.original.ceiling_price;
      const isAboveCeiling = ceilingPrice && ceilingPrice < currentValue;
      return (
        <Box
          component="span"
          sx={{
            color: isAboveCeiling ? "green" : "inherit",
            fontWeight: isAboveCeiling ? "bold" : "normal",
          }}
        >
          {ceilingPrice?.toLocaleString?.("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Box>
      );
    },
  },
  {
    accessorKey: "target_price",
    header: "Preço Alvo",
    muiEditTextFieldProps: {
      type: "number",
    },
    size: 100,
    enableEditing: true,
    filterVariant: "range",
    Cell: ({ cell }) => {
      const currentValue = cell.row.original.stock.price;
      const targetPrice = cell.row.original.target_price;
      const isBelowTarget = targetPrice && targetPrice > currentValue;
      return (
        <Box
          component="span"
          sx={{
            color: isBelowTarget ? "green" : "inherit",
            fontWeight: isBelowTarget ? "bold" : "normal",
          }}
        >
          {targetPrice?.toLocaleString?.("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Box>
      );
    },
  },

  {
    accessorKey: "stock.companyname",
    header: "Nome",
    size: 120,
    Edit: () => null,
    filterVariant: "autocomplete",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.sectorname",
    header: "Setor",
    size: 120,
    Edit: () => null,
    filterVariant: "autocomplete",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.subsectorname",
    header: "Subsetor",
    size: 120,
    Edit: () => null,
    filterVariant: "autocomplete",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.segmentname",
    header: "Segmento",
    size: 120,
    Edit: () => null,
    filterVariant: "autocomplete",
    enableColumnActions: false,
  },

  {
    accessorKey: "stock.price",
    header: "Preço atual",
    size: 80,
    filterVariant: "range",
    enableColumnActions: false,
    enableEditing: false,
    Cell: ({ cell }) =>
      cell.getValue()?.toLocaleString?.("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
  },
  {
    accessorKey: "stock.roe",
    header: "Roe",
    size: 70,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.roa",
    header: "ROA",
    size: 70,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.roic",
    header: "ROIC",
    size: 70,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.dy",
    header: "DY",
    size: 100,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.p_vp",
    header: "PVP",
    size: 70,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.vpa",
    header: "VPA",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.lpa",
    header: "LPA",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.p_l",
    header: "PL",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.p_ebit",
    header: "P/EBIT",
    size: 100,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.p_ativo",
    header: "P/Ativo",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.ev_ebit",
    header: "EV/EBIT",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.margembruta",
    header: "Margem Bruta",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.margemebit",
    header: "Margem Ebit",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.margemliquida",
    header: "Margem Líquida",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.p_capitalgiro",
    header: "Capital de giro",
    size: 100,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.p_ativocirculante",
    header: "Ativo circulante",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.giroativos",
    header: "Giro de ativo",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.dividaliquidapatrimonioliquido",
    header: "Dívida líquida/patrimônio líquido",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.dividaliquidaebit",
    header: "Dívida líquida/EBITDA",
    size: 100,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.pl_ativo",
    header: "PL/Ativo",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.passivo_ativo",
    header: "Ativo/Passivo",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.liquidezcorrente",
    header: "Liquidez Corrente",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.peg_ratio",
    header: "PEG ratio",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.receitas_cagr5",
    header: "CAGR Receitas 5 anos",
    size: 120,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.valormercado",
    header: "Valor Mercado",
    size: 100,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.graham_formula",
    header: "Fórmula Graham",
    size: 150,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.discount_to_graham",
    header: "Desconto Fórmula Graham",
    size: 130,
    Edit: () => null,
    filterVariant: "range",
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
          borderRadius: "0.25rem",
          color: "#fff",
          maxWidth: "9ch",
          p: "0.25rem",
        })}
      >
        {cell.getValue()?.toLocaleString?.("pt-BR")}
      </Box>
    ),
  },
  {
    accessorKey: "stock.roic_rank",
    header: "Rank roic",
    size: 80,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.ey_rank",
    header: "Earnings rank",
    size: 80,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    accessorKey: "stock.magic_formula_rank",
    header: "Rank fórmula mágica",
    size: 90,
    Edit: () => null,
    filterVariant: "range",
    enableColumnActions: false,
  },
  {
    id: "analise_ml",
    header: "Análise ML",
    size: 120,
    Edit: () => null,
    enableColumnActions: false,
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ row }) => {
      const { ml_label, ml_prob_barata, ml_prob_neutra, ml_prob_cara } = row.original.stock ?? {};
      if (!ml_label) return null;

      const colorMap = { BARATA: "success", NEUTRA: "primary", CARA: "error" };
      const toPercent = (v) => `${Math.round((v ?? 0) * 100)}%`;
      const tooltipText = `Barata: ${toPercent(ml_prob_barata)} | Neutra: ${toPercent(ml_prob_neutra)} | Cara: ${toPercent(ml_prob_cara)}`;

      return (
        <Tooltip title={tooltipText}>
          <Chip
            label={ml_label}
            color={colorMap[ml_label] ?? "default"}
            size="small"
            variant="filled"
          />
        </Tooltip>
      );
    },
  },
  {
    id: "ml_score",
    header: "Score ML",
    size: 80,
    Edit: () => null,
    enableColumnActions: false,
    enableSorting: false,
    enableColumnFilter: false,
    Cell: ({ row }) => row.original.stock?.ml_score ?? null,
  },
];

const Favoritas = () => {
  const [favoritas, setFavoritas] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = React.useState(false);
  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRemoveFavorite = async (stock_ticker) => {
    try {
      setLoading(true);
      await StockService.removeFavorite(stock_ticker);
      setFavoritas(
        favoritas.filter((fav) => fav.stock.ticker !== stock_ticker)
      );
      setLoading(false);
      setSnackbar({
        children: "Favorita removida com sucesso!",
        severity: "success",
      });
    } catch (error) {
      setLoading(false);
      setSnackbar({ children: "Erro ao remover favorita!", severity: "error" });
    }
  };

  const handleEditFavorite = async (newRow) => {
    try {
      setLoading(true);
      await StockService.editFavorite(
        newRow.row.original.id,
        newRow.row._valuesCache
      );

      const updatedFavoritas = favoritas.map((fav) => {
        if (fav.id === newRow.row.original.id) {
          return {
            ...fav,
            ...newRow.row._valuesCache,
          };
        }
        return fav;
      });

      setFavoritas(updatedFavoritas);

      setLoading(false);

      table.setEditingRow(null);
      setSnackbar({
        children: "Favorita editada com sucesso!",
        severity: "success",
      });
    } catch (error) {
      setLoading(false);
      setSnackbar({ children: "Erro ao editar favorita!", severity: "error" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await StockService.getFavorites();
        setFavoritas(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveLayout = async () => {
    const tableState = collectTableState(table);
    if (!tableState) return;

    const json = JSON.stringify(tableState);
    sessionStorage.setItem("stateListaFavoritas", json);
    setLoading(true);
    try {
      await UserLayoutService.saveLayout("ListaFavoritas", json);
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
    data: favoritas,
    enableEditing: true,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    columnFilterDisplayMode: "popover",
    layoutMode: "grid",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 90,
        grow: false,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => handleRemoveFavorite(row.original.stock.ticker)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    editDisplayMode: "modal",
    localization: MRT_Localization_PT_BR,
    onEditingRowSave: handleEditFavorite,
    initialState: JSON.parse(sessionStorage.getItem("stateListaFavoritas")) || {
      pagination: { pageSize: 15 },
      density: "compact",
      columnVisibility: {
        id: false,
        "stock.companyname": false,
        "stock.sectorname": false,
        "stock.subsectorname": false,
        "stock.segmentname": false,
        "stock.vpa": false,
        "stock.lpa": false,
        "stock.p_l": false,
        "stock.p_ebit": false,
        "stock.p_ativo": false,
        "stock.ev_ebit": false,
        "stock.margembruta": false,
        "stock.margemebit": false,
        "stock.margemliquida": false,
        "stock.p_capitalgiro": false,
        "stock.p_ativocirculante": false,
        "stock.giroativos": false,
        "stock.dividaliquidapatrimonioliquido": false,
        "stock.dividaliquidaebit": false,
        "stock.pl_ativo": false,
        "stock.passivo_ativo": false,
        "stock.liquidezcorrente": false,
        "stock.peg_ratio": false,
        "stock.receitas_cagr5": false,
        "stock.valormercado": false,
        "stock.roic_rank ": false,
        "stock.ey_rank": false,
      },
    },
    renderTopToolbarCustomActions: () => (
      <Button
        color="primary"
        onClick={saveLayout}
        startIcon={<Save />}
        variant="contained"
      >
        Salvar Layout
      </Button>
    ),
  });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>

      {favoritas.length === 0 ? (
        <Typography variant="h6">Nenhuma ação favorita encontrada</Typography>
      ) : (
        <MaterialReactTable table={table} />
      )}
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
};

export default Favoritas;
