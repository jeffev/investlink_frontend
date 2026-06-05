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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Slider,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
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
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
};

const PnlCell = ({ value, formatter }) => (
  <Box component="span" sx={{ color: value >= 0 ? "success.main" : "error.main" }}>
    {formatter(value)}
  </Box>
);

const SummaryCards = ({ summary, projectedMonthly }) => {
  const cards = [
    { label: "Total Investido (Ações)", value: formatCurrency(summary?.total_invested) },
    { label: "Valor Atual (Ações)", value: formatCurrency(summary?.current_value) },
    { label: "Resultado Total", value: formatCurrency(summary?.total_pnl) },
    { label: "Rentabilidade", value: formatPercent(summary?.total_pnl_percent) },
    {
      label: "Renda Mensal Projetada",
      value: formatCurrency(projectedMonthly),
      color: "success.main",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={card.label === "Renda Mensal Projetada" ? 4 : 3} key={card.label}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h6" sx={{ color: card.color || "inherit" }}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const EMPTY_STOCK_FORM = { ticker: "", quantity: "", average_price: "" };
const EMPTY_FII_FORM = { fii_ticker: "", quantity: "", average_price: "" };

const AddPositionModal = ({ open, onClose, onAdd, loading }) => {
  const [form, setForm] = useState(EMPTY_STOCK_FORM);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () =>
    onAdd({
      ticker: form.ticker.trim().toUpperCase(),
      quantity: Number(form.quantity),
      average_price: Number(form.average_price),
    });

  const handleClose = () => {
    setForm(EMPTY_STOCK_FORM);
    onClose();
  };

  const isValid =
    form.ticker.trim() !== "" &&
    Number(form.quantity) > 0 &&
    Number(form.average_price) > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Adicionar ação</DialogTitle>
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
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid || loading}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddFiiPositionModal = ({ open, onClose, onAdd, loading }) => {
  const [form, setForm] = useState(EMPTY_FII_FORM);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () =>
    onAdd({
      fii_ticker: form.fii_ticker.trim().toUpperCase(),
      quantity: Number(form.quantity),
      average_price: Number(form.average_price),
    });

  const handleClose = () => {
    setForm(EMPTY_FII_FORM);
    onClose();
  };

  const isValid =
    form.fii_ticker.trim() !== "" &&
    Number(form.quantity) > 0 &&
    Number(form.average_price) > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Adicionar FII</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <TextField
          label="Ticker (ex: KNRI11)"
          name="fii_ticker"
          value={form.fii_ticker}
          onChange={handleChange}
          autoFocus
          inputProps={{ style: { textTransform: "uppercase" } }}
        />
        <TextField
          label="Quantidade de cotas"
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
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid || loading}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LS_KEY = "portfolioTargetAllocation";

function loadTargetFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.targetStocks === "number") return parsed.targetStocks;
    }
  } catch {}
  return 60;
}

function AllocationBar({ label, currentPct, targetPct }) {
  const deviation = currentPct - targetPct;
  const isOver = deviation > 0;
  const color = Math.abs(deviation) <= 2 ? "success" : isOver ? "error" : "warning";

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            atual {currentPct.toFixed(1)}% / alvo {targetPct.toFixed(0)}%
          </Typography>
          <Chip
            label={`${deviation >= 0 ? "+" : ""}${deviation.toFixed(1)}%`}
            color={color}
            size="small"
          />
        </Box>
      </Box>
      <Box sx={{ position: "relative", height: 10, borderRadius: 1, bgcolor: "action.hover" }}>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            borderRadius: 1,
            width: `${Math.min(currentPct, 100)}%`,
            bgcolor: `${color}.main`,
            transition: "width 0.3s ease",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: -3,
            left: `${Math.min(targetPct, 100)}%`,
            height: 16,
            width: 2,
            bgcolor: "text.primary",
            borderRadius: 1,
          }}
        />
      </Box>
      <LinearProgress sx={{ display: "none" }} />
    </Box>
  );
}

function RebalanceTab({ positions, fiiPositions }) {
  const [targetStocks, setTargetStocks] = useState(loadTargetFromStorage);

  const targetFiis = 100 - targetStocks;

  const totalStocksValue = positions.reduce((s, p) => s + (p.current_value || 0), 0);
  const totalFiisValue = fiiPositions.reduce((s, p) => s + (p.current_value || 0), 0);
  const totalValue = totalStocksValue + totalFiisValue;

  const currentStocksPct = totalValue > 0 ? (totalStocksValue / totalValue) * 100 : 0;
  const currentFiisPct = totalValue > 0 ? (totalFiisValue / totalValue) * 100 : 0;

  const deviationStocks = currentStocksPct - targetStocks;
  const amountToRebalance = Math.abs((deviationStocks / 100) * totalValue);

  const handleSliderChange = (_, value) => {
    setTargetStocks(value);
    localStorage.setItem(LS_KEY, JSON.stringify({ targetStocks: value }));
  };

  // Sector breakdown within stocks
  const sectors = Object.entries(
    positions.reduce((acc, p) => {
      const sector = p.sectorname || "Outros";
      acc[sector] = (acc[sector] || 0) + (p.current_value || 0);
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      value,
      pct: totalStocksValue > 0 ? (value / totalStocksValue) * 100 : 0,
    }));

  if (totalValue === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Adicione posições em ações ou FIIs para ver o rebalanceamento.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Alocação Ações vs FIIs */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Alocação: Ações vs FIIs
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ minWidth: 60 }}>Ações {targetStocks}%</Typography>
            <Slider
              value={targetStocks}
              onChange={handleSliderChange}
              min={0}
              max={100}
              step={5}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `Ações ${v}% / FIIs ${100 - v}%`}
              sx={{ flex: 1 }}
            />
            <Typography variant="body2" sx={{ minWidth: 60, textAlign: "right" }}>
              FIIs {targetFiis}%
            </Typography>
          </Box>

          <AllocationBar
            label="Ações"
            currentPct={currentStocksPct}
            targetPct={targetStocks}
          />
          <AllocationBar
            label="FIIs"
            currentPct={currentFiisPct}
            targetPct={targetFiis}
          />

          {Math.abs(deviationStocks) > 2 && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 1,
                bgcolor: "action.hover",
                borderLeft: 4,
                borderColor: deviationStocks > 0 ? "error.main" : "warning.main",
              }}
            >
              <Typography variant="body2">
                {deviationStocks > 0 ? (
                  <>
                    <strong>Ações</strong> está {deviationStocks.toFixed(1)}% acima do alvo
                    ({formatCurrency(amountToRebalance)} a mais).{" "}
                    <strong>Sugestão:</strong> aporte {formatCurrency(amountToRebalance)} em FIIs.
                  </>
                ) : (
                  <>
                    <strong>FIIs</strong> está {Math.abs(deviationStocks).toFixed(1)}% acima do alvo
                    ({formatCurrency(amountToRebalance)} a mais).{" "}
                    <strong>Sugestão:</strong> aporte {formatCurrency(amountToRebalance)} em Ações.
                  </>
                )}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Concentração por Setor */}
      {sectors.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Concentração por Setor (Ações)
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Setor</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="right">% das Ações</TableCell>
                  <TableCell sx={{ width: "35%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sectors.map(({ name, value, pct }) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell align="right">{formatCurrency(value)}</TableCell>
                    <TableCell align="right">{pct.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 1,
                            bgcolor: "action.hover",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              height: "100%",
                              borderRadius: 1,
                              width: `${pct}%`,
                              bgcolor: pct > 40 ? "error.main" : pct > 25 ? "warning.main" : "primary.main",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

const Portfolio = () => {
  const [positions, setPositions] = useState([]);
  const [fiiPositions, setFiiPositions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [projectedIncome, setProjectedIncome] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addFiiModalOpen, setAddFiiModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const stockColumns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 60, enableEditing: false, Edit: () => null },
      { accessorKey: "ticker", header: "Ticker", size: 90, enableEditing: false },
      { accessorKey: "quantity", header: "Qtd", size: 80, enableEditing: false },
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
        Cell: ({ cell }) => <PnlCell value={cell.getValue()} formatter={formatCurrency} />,
      },
      {
        accessorKey: "pnl_percent",
        header: "Rentabilidade (%)",
        size: 140,
        enableEditing: false,
        Cell: ({ cell }) => <PnlCell value={cell.getValue()} formatter={formatPercent} />,
      },
    ],
    []
  );

  const fiiColumns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 60, enableEditing: false, Edit: () => null },
      { accessorKey: "fii_ticker", header: "Ticker", size: 90, enableEditing: false },
      { accessorKey: "companyname", header: "Fundo", size: 180, enableEditing: false },
      { accessorKey: "quantity", header: "Cotas", size: 80, enableEditing: false },
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
        Cell: ({ cell }) => <PnlCell value={cell.getValue()} formatter={formatCurrency} />,
      },
      {
        accessorKey: "pnl_percent",
        header: "Rentabilidade (%)",
        size: 140,
        enableEditing: false,
        Cell: ({ cell }) => <PnlCell value={cell.getValue()} formatter={formatPercent} />,
      },
      {
        accessorKey: "monthly_income",
        header: "Renda Mensal",
        size: 130,
        enableEditing: false,
        Cell: ({ cell }) => (
          <Box component="span" sx={{ color: "success.main" }}>
            {formatCurrency(cell.getValue())}
          </Box>
        ),
      },
    ],
    []
  );

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const [data, summaryData, fiiData] = await Promise.all([
        PortfolioService.getPortfolio(),
        PortfolioService.getPortfolioSummary(),
        PortfolioService.getFiiPortfolio(),
      ]);
      setPositions(data);
      setSummary(summaryData);
      setFiiPositions(fiiData);
    } catch (error) {
      setSnackbar({ children: "Erro ao carregar portfólio!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    PortfolioService.getProjectedIncome()
      .then((data) => setProjectedIncome(data))
      .catch(() => {});
  }, [positions, fiiPositions]);

  const handleEditPosition = async (newRow) => {
    try {
      setLoading(true);
      await PortfolioService.editPosition(newRow.row.original.id, newRow.row._valuesCache);
      await fetchPortfolio();
      stockTable.setEditingRow(null);
      setSnackbar({ children: "Posição editada com sucesso!", severity: "success" });
    } catch {
      setSnackbar({ children: "Erro ao editar posição!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePosition = async (positionId) => {
    try {
      setLoading(true);
      await PortfolioService.deletePosition(positionId);
      await fetchPortfolio();
      setSnackbar({ children: "Posição removida com sucesso!", severity: "success" });
    } catch {
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
    } catch {
      setSnackbar({ children: "Erro ao adicionar posição!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFiiPosition = async (newRow) => {
    try {
      setLoading(true);
      await PortfolioService.editFiiPosition(newRow.row.original.id, newRow.row._valuesCache);
      await fetchPortfolio();
      fiiTable.setEditingRow(null);
      setSnackbar({ children: "Posição FII editada com sucesso!", severity: "success" });
    } catch {
      setSnackbar({ children: "Erro ao editar posição FII!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFiiPosition = async (positionId) => {
    try {
      setLoading(true);
      await PortfolioService.deleteFiiPosition(positionId);
      await fetchPortfolio();
      setSnackbar({ children: "Posição FII removida com sucesso!", severity: "success" });
    } catch {
      setSnackbar({ children: "Erro ao remover posição FII!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFiiPosition = async (data) => {
    try {
      setLoading(true);
      await PortfolioService.addFiiPosition(data);
      setAddFiiModalOpen(false);
      await fetchPortfolio();
      setSnackbar({ children: "FII adicionado com sucesso!", severity: "success" });
    } catch {
      setSnackbar({ children: "Erro ao adicionar FII!", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const tableCommonOptions = {
    enableEditing: true,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    columnFilterDisplayMode: "popover",
    layoutMode: "grid",
    displayColumnDefOptions: { "mrt-row-actions": { size: 90, grow: false } },
    localization: MRT_Localization_PT_BR,
    initialState: { pagination: { pageSize: 15 }, density: "compact", columnVisibility: { id: false } },
  };

  const stockTable = useMaterialReactTable({
    ...tableCommonOptions,
    columns: stockColumns,
    data: positions,
    onEditingRowSave: handleEditPosition,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remover">
          <IconButton color="error" onClick={() => handleDeletePosition(row.original.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Button
        color="primary"
        onClick={() => setAddModalOpen(true)}
        startIcon={<AddIcon />}
        variant="contained"
      >
        Adicionar ação
      </Button>
    ),
  });

  const fiiTable = useMaterialReactTable({
    ...tableCommonOptions,
    columns: fiiColumns,
    data: fiiPositions,
    onEditingRowSave: handleEditFiiPosition,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remover">
          <IconButton color="error" onClick={() => handleDeleteFiiPosition(row.original.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Button
        color="primary"
        onClick={() => setAddFiiModalOpen(true)}
        startIcon={<AddIcon />}
        variant="contained"
      >
        Adicionar FII
      </Button>
    ),
  });

  return (
    <Box sx={{ p: 2 }}>
      <LoadingBackdrop open={loading} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Minha Carteira
      </Typography>

      <SummaryCards
        summary={summary}
        projectedMonthly={projectedIncome?.monthly ?? null}
      />

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label={`Ações (${positions.length})`} />
        <Tab label={`FIIs (${fiiPositions.length})`} />
        <Tab label="Rebalanceamento" />
      </Tabs>

      {activeTab === 0 && (
        positions.length === 0 && !loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
            <Typography variant="body1">Nenhuma posição em ações.</Typography>
            <Button
              color="primary"
              onClick={() => setAddModalOpen(true)}
              startIcon={<AddIcon />}
              variant="contained"
            >
              Adicionar ação
            </Button>
          </Box>
        ) : (
          <MaterialReactTable table={stockTable} />
        )
      )}

      {activeTab === 1 && (
        fiiPositions.length === 0 && !loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
            <Typography variant="body1">Nenhum FII na carteira.</Typography>
            <Button
              color="primary"
              onClick={() => setAddFiiModalOpen(true)}
              startIcon={<AddIcon />}
              variant="contained"
            >
              Adicionar FII
            </Button>
          </Box>
        ) : (
          <MaterialReactTable table={fiiTable} />
        )
      )}

      {activeTab === 2 && (
        <RebalanceTab positions={positions} fiiPositions={fiiPositions} />
      )}

      <AddPositionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddPosition}
        loading={loading}
      />

      <AddFiiPositionModal
        open={addFiiModalOpen}
        onClose={() => setAddFiiModalOpen(false)}
        onAdd={handleAddFiiPosition}
        loading={loading}
      />

      <FeedbackSnackbar snackbar={snackbar} onClose={handleCloseSnackbar} />
    </Box>
  );
};

export default Portfolio;
