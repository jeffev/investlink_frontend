import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PortfolioService from "../services/portfolio.service";
import { LoadingBackdrop, FeedbackSnackbar } from "../components/Common/FeedbackUI";
import BenchmarkBar from "../components/BenchmarkBar";
import SummaryCards from "../components/Portfolio/SummaryCards";
import AddPositionModal from "../components/Portfolio/AddPositionModal";
import AddFiiPositionModal from "../components/Portfolio/AddFiiPositionModal";
import RebalanceTab from "../components/Portfolio/RebalanceTab";
import ConcentrationTab from "../components/Portfolio/ConcentrationTab";
import HistoricoTab from "../components/Portfolio/HistoricoTab";
import { formatCurrency, formatPercent, PnlCell } from "../utils/portfolioFormatters";

const TABLE_COMMON_OPTIONS = {
  enableEditing: true,
  enableColumnFilterModes: true,
  enableColumnOrdering: true,
  enableColumnResizing: true,
  columnFilterDisplayMode: "popover",
  layoutMode: "grid",
  displayColumnDefOptions: { "mrt-row-actions": { size: 90, grow: false } },
  localization: MRT_Localization_PT_BR,
  initialState: {
    pagination: { pageSize: 15 },
    density: "compact",
    columnVisibility: { id: false },
  },
};

const Portfolio = () => {
  const [positions, setPositions] = useState([]);
  const [fiiPositions, setFiiPositions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [projectedIncome, setProjectedIncome] = useState(null);
  const [benchmarks, setBenchmarks] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addFiiModalOpen, setAddFiiModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

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
    } catch {
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

  useEffect(() => {
    PortfolioService.getBenchmarks()
      .then((data) => setBenchmarks(data))
      .catch(() => {});
  }, []);

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

  const stockTable = useMaterialReactTable({
    ...TABLE_COMMON_OPTIONS,
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
    ...TABLE_COMMON_OPTIONS,
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

      <SummaryCards summary={summary} projectedMonthly={projectedIncome?.monthly ?? null} />

      <BenchmarkBar benchmarks={benchmarks} portfolioPct={summary?.total_pnl_percent ?? null} />

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label={`Ações (${positions.length})`} />
        <Tab label={`FIIs (${fiiPositions.length})`} />
        <Tab label="Rebalanceamento" />
        <Tab label="Concentração" />
        <Tab label="Histórico" />
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

      {activeTab === 3 && (
        <ConcentrationTab positions={positions} fiiPositions={fiiPositions} />
      )}

      {activeTab === 4 && <HistoricoTab />}

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

      <FeedbackSnackbar snackbar={snackbar} onClose={() => setSnackbar(null)} />
    </Box>
  );
};

export default Portfolio;
