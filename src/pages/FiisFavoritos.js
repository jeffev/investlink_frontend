import React, { useState, useEffect, useMemo } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import FiiService from "../services/fii.service";

import UserLayoutService from "../services/userLayout.service";
import { collectTableState } from "../utils/tableLayout";
import { getFiiColumns } from "../columns/fiiColumns";
import { LoadingBackdrop, FeedbackSnackbar } from "../components/Common/FeedbackUI";

const FavoritosFiis = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);
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
      accessorKey: 'fii.ticker',
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
      Cell: ({ cell }) => {
        const currentValue = cell.row.original.fii.price;
        const ceilingPrice = cell.row.original.ceiling_price;
        const isAboveCeiling = ceilingPrice && ceilingPrice > currentValue;
        return (
          <Box
            component="span"
            sx={{
              color: isAboveCeiling ? 'success.main' : 'inherit',
              fontWeight: isAboveCeiling ? 'bold' : 'normal',
            }}
          >
            {ceilingPrice?.toLocaleString?.('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Box>
        );
      },
    },
    {
      accessorKey: 'target_price',
      header: 'Preço Alvo',
      muiEditTextFieldProps: { type: 'number' },
      size: 100,
      enableEditing: true,
      filterVariant: 'range',
      Cell: ({ cell }) => {
        const currentValue = cell.row.original.fii.price;
        const targetPrice = cell.row.original.target_price;
        const isBelowTarget = targetPrice && targetPrice > currentValue;
        return (
          <Box
            component="span"
            sx={{
              color: isBelowTarget ? 'success.main' : 'inherit',
              fontWeight: isBelowTarget ? 'bold' : 'normal',
            }}
          >
            {targetPrice?.toLocaleString?.('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Box>
        );
      },
    },
    {
      accessorKey: 'fii.price',
      header: 'Preço atual',
      size: 120,
      filterVariant: 'range',
      enableEditing: false,
      enableColumnActions: false,
      Edit: () => null,
      Cell: ({ cell }) =>
        cell.getValue()?.toLocaleString?.('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
    ...getFiiColumns('fii', true),
  ], []);

  const handleRemoveFavorite = async (ticker) => {
    try {
      setLoading(true);
      await FiiService.removeFavorite(ticker);
      setFavoritos(favoritos.filter((fav) => fav.fii.ticker !== ticker));
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
      await FiiService.editFavorite(
        newRow.row.original.id,
        newRow.row._valuesCache
      );

      const updatedFavoritos = favoritos.map((fav) => {
        if (fav.id === newRow.row.original.id) {
          return {
            ...fav,
            ...newRow.row._valuesCache,
          };
        }
        return fav;
      });

      setFavoritos(updatedFavoritos);

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
        const data = await FiiService.getFavorites();
        setFavoritos(data);
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
    sessionStorage.setItem("stateListaFavoritosFiis", json);
    setLoading(true);
    try {
      await UserLayoutService.saveLayout("ListaFavoritosFiis", json);
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
    data: favoritos,
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
            onClick={() => handleRemoveFavorite(row.original.fii.ticker)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
    editDisplayMode: "modal",
    localization: MRT_Localization_PT_BR,
    onEditingRowSave: handleEditFavorite,
    initialState: JSON.parse(
      sessionStorage.getItem("stateListaFavoritosFiis")
    ) || {
      pagination: { pageSize: 15 },
      density: "compact",
      columnVisibility: {
        id: false,
        "fii.companyname": false,
        "fii.sectorname": false,
        "fii.subsectorname": false,
        "fii.segment": false,
        "fii.gestao": false,
        "fii.valorpatrimonialcota": false,
        "fii.liquidezmediadiaria": false,
        "fii.percentualcaixa": false,
        "fii.dividend_cagr": false,
        "fii.cota_cagr": false,
        "fii.numerocotistas": false,
        "fii.numerocotas": false,
        "fii.patrimonio": false,
        "fii.lastdividend": false,
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <LoadingBackdrop open={loading} />
      <FeedbackSnackbar snackbar={snackbar} onClose={handleCloseSnackbar} />
    </>
  );
};

export default FavoritosFiis;
