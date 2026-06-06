import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PortfolioService from "../../services/portfolio.service";
import { LoadingBackdrop, FeedbackSnackbar } from "../Common/FeedbackUI";
import { formatCurrency } from "../../utils/portfolioFormatters";

const TX_TYPES = ["COMPRA", "VENDA"];
const TX_ASSET_TYPES = ["STOCK", "FII"];
const EMPTY_TX_FORM = {
  ticker: "",
  type: "COMPRA",
  asset_type: "STOCK",
  quantity: "",
  price: "",
  date: new Date().toISOString().slice(0, 10),
};

function HistoricoTab() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    total_compras: 0,
    total_vendas: 0,
    resultado_realizado: 0,
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_TX_FORM);
  const [snackbar, setSnackbar] = useState(null);

  const fetchTransactions = () => {
    setLoading(true);
    PortfolioService.getTransactions()
      .then((res) => {
        setTransactions(res.data || []);
        setSummary(res.summary || {});
      })
      .catch(() => setSnackbar({ children: "Erro ao carregar transações!", severity: "error" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    setLoading(true);
    try {
      await PortfolioService.createTransaction({
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
      });
      setModalOpen(false);
      setForm(EMPTY_TX_FORM);
      fetchTransactions();
      setSnackbar({ children: "Transação registrada!", severity: "success" });
    } catch {
      setSnackbar({ children: "Erro ao registrar transação!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await PortfolioService.deleteTransaction(id);
      fetchTransactions();
      setSnackbar({ children: "Transação removida!", severity: "success" });
    } catch {
      setSnackbar({ children: "Erro ao remover transação!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.ticker.trim() &&
    TX_TYPES.includes(form.type) &&
    Number(form.quantity) > 0 &&
    Number(form.price) > 0 &&
    form.date;

  const resultColor = summary.resultado_realizado >= 0 ? "success.main" : "error.main";

  return (
    <Box>
      <LoadingBackdrop open={loading} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: "Total Compras", value: formatCurrency(summary.total_compras) },
          { label: "Total Vendas", value: formatCurrency(summary.total_vendas) },
          {
            label: "Resultado Realizado",
            value: formatCurrency(summary.resultado_realizado),
            color: resultColor,
          },
        ].map((c) => (
          <Grid item xs={12} sm={4} key={c.label}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">{c.label}</Typography>
                <Typography variant="h6" sx={{ color: c.color || "inherit" }}>{c.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
          Registrar transação
        </Button>
      </Box>

      {transactions.length === 0 && !loading ? (
        <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
          Nenhuma transação registrada.
        </Typography>
      ) : (
        <Card variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Ticker</TableCell>
                <TableCell align="right">Qtd</TableCell>
                <TableCell align="right">Preço</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={tx.type}
                      color={tx.type === "COMPRA" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{tx.ticker}</TableCell>
                  <TableCell align="right">{tx.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(tx.price)}</TableCell>
                  <TableCell align="right">{formatCurrency(tx.total)}</TableCell>
                  <TableCell>
                    <Tooltip title="Remover">
                      <IconButton size="small" color="error" onClick={() => handleDelete(tx.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Registrar transação</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            select
            label="Tipo"
            name="type"
            value={form.type}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            {TX_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </TextField>
          <TextField
            select
            label="Ativo"
            name="asset_type"
            value={form.asset_type}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            {TX_ASSET_TYPES.map((t) => (
              <option key={t} value={t}>{t === "STOCK" ? "Ação" : "FII"}</option>
            ))}
          </TextField>
          <TextField
            label="Ticker"
            name="ticker"
            value={form.ticker}
            onChange={handleChange}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
          <TextField
            label="Quantidade"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            inputProps={{ min: 0, step: "any" }}
          />
          <TextField
            label="Preço (R$)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
          />
          <TextField
            label="Data"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={!isFormValid || loading}
          >
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      <FeedbackSnackbar snackbar={snackbar} onClose={() => setSnackbar(null)} />
    </Box>
  );
}

export default HistoricoTab;
