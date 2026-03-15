import React, { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PortfolioService from "../services/portfolio.service";
import { LoadingBackdrop, FeedbackSnackbar } from "../components/Common/FeedbackUI";

const formatCurrency = (value) => {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatPercent = (value) => {
  if (value == null) return "—";
  return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
};

const PnlCell = ({ value, formatter }) => (
  <Box
    component="span"
    sx={{ color: value >= 0 ? "success.main" : "error.main" }}
  >
    {formatter(value)}
  </Box>
);

const SummaryCards = ({ summary }) => {
  const cards = [
    { label: "Total Investido", value: formatCurrency(summary.total_invested) },
    { label: "Valor Atual", value: formatCurrency(summary.current_value) },
    { label: "Resultado Total", value: formatCurrency(summary.total_pnl) },
    { label: "Rentabilidade", value: formatPercent(summary.total_pnl_percent) },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h6">{card.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const EMPTY_FORM = { ticker: "", quantity: "", average_price: "" };

const AddPositionModal = ({ open, onClose, onAdd, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onAdd({
      ticker: form.ticker.trim().toUpperCase(),
      quantity: Number(form.quantity),
      average_price: Number(form.average_price),
    });
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const isValid =
    form.ticker.trim() !== "" &&
    Number(form.quantity) > 0 &&
    Number(form.average_price) > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Adicionar posição</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <TextField
          label="Ticker"
          name="ticker"
          value={form.ticker}
          onChange={handleChange}
          autoFocus
          inputProps={{ style: { textTransform: "uppercase" } }}
        />
        <TextField
          label="Quantidade"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Preço médio (R$)"
          name="average_price"
          type="number"
          value={form.average_price}
          onChange={handleChange}
          inputProps={{ min: 0, step: "0.01" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid || loading}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Portfolio = () => {
  const [positions, setPositions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
        enableEditing: false,
        Edit: () => null,
      },
      {
        accessorKey: "ticker",
        header: "Ticker",
        size: 90,
        enableEditing: false,
      },
      {
        accessorKey: "quantity",
        header: "Qtd",
        size: 80,
        enableEditing: false,
      },
      {
        accessorKey: "average_price",
        header: "Preço Médio",
        size: 120,
        enableEditing: true,
        muiEditTextFieldProps: { type: "number" },
        Cell: ({ cell }) => formatCurrency(cell.getValue()),
      },
      {
        accessorKey: "current_price",
        header: "Preço Atual",
        size: 120,
        enableEditing: false,
        Cell: ({ cell }) => formatCurrency(cell.getValue()),
      },
      {
        accessorKey: "total_invested",
        header: "Total Investido",
        size: 130,
        enableEditing: false,
        Cell: ({ cell }) => formatCurrency(cell.getValue()),
      },
      {
        accessorKey: "current_value",
        header: "Valor Atual",
        size: 120,
        enableEditing: false,
        Cell: ({ cell }) => formatCurrency(cell.getValue()),
      },
      {
        accessorKey: "pnl",
        header: "Resultado (R$)",
        size: 130,
        enableEditing: false,
        Cell: ({ cell }) => (
          <PnlCell value={cell.getValue()} formatter={formatCurrency} />
        ),
      },
      {
        accessorKey: "pnl_percent",
        header: "Rentabilidade (%)",
        size: 140,
        enableEditing: false,
        Cell: ({ cell }) => (
          <PnlCell value={cell.getValue()} formatter={formatPercent} />
        ),
      },
    ],
    []
  );

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const [data, summaryData] = await Promise.all([
        PortfolioService.getPortfolio(),
        PortfolioService.getPortfolioSummary(),
      ]);
      setPositions(data);
      setSummary(summaryData);
    } catch (error) {
      console.error(error);
      setSnackbar({ children: "Erro ao carregar portfólio!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleEditPosition = async (newRow) => {
    try {
      setLoading(true);
      await PortfolioService.editPosition(
        newRow.row.original.id,
        newRow.row._valuesCache
      );

      const updated = positions.map((pos) => {
        if (pos.id === newRow.row.original.id) {
          return { ...pos, ...newRow.row._valuesCache };
        }
        return pos;
      });

      setPositions(updated);
      table.setEditingRow(null);
      setSnackbar({ children: "Posição editada com sucesso!", severity: "success" });
    } catch (error) {
      setSnackbar({ children: "Erro ao editar posição!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePosition = async (positionId) => {
    try {
      setLoading(true);
      await PortfolioService.deletePosition(positionId);
      setPositions(positions.filter((pos) => pos.id !== positionId));
      setSnackbar({ children: "Posição removida com sucesso!", severity: "success" });
    } catch (error) {
      setSnackbar({ children: "Erro ao remover posição!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPosition = async (data) => {
    try {
      setLoading(true);
      await PortfolioService.addPosition(data);
      setAddModalOpen(false);
      await fetchPortfolio();
      setSnackbar({ children: "Posição adicionada com sucesso!", severity: "success" });
    } catch (error) {
      setSnackbar({ children: "Erro ao adicionar posição!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: positions,
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
        <Tooltip title="Editar">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remover">
          <IconButton
            color="error"
            onClick={() => handleDeletePosition(row.original.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    editDisplayMode: "modal",
    localization: MRT_Localization_PT_BR,
    onEditingRowSave: handleEditPosition,
    initialState: {
      pagination: { pageSize: 15 },
      density: "compact",
      columnVisibility: { id: false },
    },
    renderTopToolbarCustomActions: () => (
      <Button
        color="primary"
        onClick={() => setAddModalOpen(true)}
        startIcon={<AddIcon />}
        variant="contained"
      >
        Adicionar posição
      </Button>
    ),
  });

  return (
    <Box sx={{ p: 2 }}>
      <LoadingBackdrop open={loading} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Minha Carteira
      </Typography>

      {summary && <SummaryCards summary={summary} />}

      {positions.length === 0 && !loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
          <Typography variant="body1">Nenhuma posição encontrada.</Typography>
          <Button
            color="primary"
            onClick={() => setAddModalOpen(true)}
            startIcon={<AddIcon />}
            variant="contained"
          >
            Adicionar posição
          </Button>
        </Box>
      ) : (
        <MaterialReactTable table={table} />
      )}

      <AddPositionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddPosition}
        loading={loading}
      />

      <FeedbackSnackbar snackbar={snackbar} onClose={handleCloseSnackbar} />
    </Box>
  );
};

export default Portfolio;
