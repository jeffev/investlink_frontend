import React, { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import DeleteIcon from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import StockService from "../services/stock.service";
import PriceCell from '../components/Table/PriceCell';

import UserLayoutService from "../services/userLayout.service";
import { collectTableState } from "../utils/tableLayout";
import { getStockColumns } from "../columns/stockColumns";
import { LoadingBackdrop, FeedbackSnackbar } from "../components/Common/FeedbackUI";

const PER_PAGE = 50;

const Favoritas = () => {
  const [favoritas, setFavoritas] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const handleCloseSnackbar = () => setSnackbar(null);

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      enableEditing: false,
      Edit: () => null,
      enableHiding: false,
    },
    {
      accessorKey: 'stock.ticker',
      header: 'Ticker',
      size: 80,
      enableEditing: false,
    },
    {
      accessorKey: 'ceiling_price',
      header: 'Preço Teto',
      muiEditTextFieldProps: { type: 'number' },
      size: 100,
      enableEditing: true,
      filterVariant: 'range',
      Cell: ({ cell }) => (
        <PriceCell
          price={cell.row.original.ceiling_price}
          currentPrice={cell.row.original.stock.price}
        />
      ),
    },
    {
      accessorKey: 'target_price',
      header: 'Preço Alvo',
      muiEditTextFieldProps: { type: 'number' },
      size: 100,
      enableEditing: true,
      filterVariant: 'range',
      Cell: ({ cell }) => (
        <PriceCell
          price={cell.row.original.target_price}
          currentPrice={cell.row.original.stock.price}
        />
      ),
    },
    ...getStockColumns('stock', true),
  ], []);

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
        const result = await StockService.getFavorites(page, PER_PAGE);
        const items = result?.data ?? result;
        const totalCount = result?.pagination?.total ?? items.length;
        setFavoritas(items);
        setTotal(totalCount);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

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
        "stock.roic_rank": false,
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
      <LoadingBackdrop open={loading} />

      {favoritas.length === 0 ? (
        <Typography variant="h6">Nenhuma ação favorita encontrada</Typography>
      ) : (
        <MaterialReactTable table={table} />
      )}

      {total > PER_PAGE && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(total / PER_PAGE)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <FeedbackSnackbar snackbar={snackbar} onClose={handleCloseSnackbar} />
    </div>
  );
};

export default Favoritas;
