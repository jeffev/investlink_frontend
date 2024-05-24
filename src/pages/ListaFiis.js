import React, { useState, useEffect } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Backdrop, CircularProgress, Box, Button } from "@mui/material";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import Download from "@mui/icons-material/Download";
import Save from "@mui/icons-material/Save";
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { darken } from "@mui/material";
import FIIService from "../services/fii.service";
import AuthService from "../services/auth.service";
import UserLayoutService from "../services/userLayout.service";

const columns = [
  { id: "ticker", accessorKey: "ticker", header: "Ticker", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  { accessorKey: "companyname", header: "Nome", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  { accessorKey: "sectorname", header: "Setor", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  { accessorKey: "subsectorname", header: "Subsetor", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  { accessorKey: "segment", header: "Segmento", size: 120, filterVariant: 'autocomplete', enableColumnActions: false },
  { accessorKey: "price", header: "Preço", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "dy", header: "DY", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "p_vp", header: "P/VP", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "valorpatrimonialcota", header: "Valor Patrimonial Cota", size: 180, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "liquidezmediadiaria", header: "Liquidez Média Diária", size: 180, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "percentualcaixa", header: "% Caixa", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "dividend_cagr", header: "Dividend CAGR", size: 150, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "cota_cagr", header: "Cota CAGR", size: 150, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "numerocotistas", header: "Número Cotistas", size: 150, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "numerocotas", header: "Número Cotas", size: 150, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "patrimonio", header: "Patrimônio", size: 120, filterVariant: 'range', enableColumnActions: false },
  { accessorKey: "lastdividend", header: "Último Dividendo", size: 150, filterVariant: 'range', enableColumnActions: false },
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
  const isAdmin = AuthService.isAdmin();

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(lista);
    download(csvConfig)(csv);
  };

  const handleUpdateFIIs = async () => {
    setLoading(true);

    try {
      await FIIService.updateFIIs();
      setLoading(false);
      
      const updatedFIIs = await FIIService.getAllFIIs();
      setLista(updatedFIIs);
    } catch (error) {
      console.error("Error updating FIIs:", error);
      setLoading(false);
    }
  };

  const handleSaveLayout = async (state) => {
    setLoading(true);

    try {
      await UserLayoutService.saveLayout("ListaFiis", state);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao salvar o layout:', error);
      setLoading(false);
    }
  };

  const saveColumnStateToSessionStorage = () => {
    let state = table.getState();

    const tableState = {};

    if (Object.keys(state.columnVisibility).length > 0) {
      tableState.columnVisibility = state.columnVisibility;
    }
    if (Object.keys(state.columnOrder).length > 0) {
      tableState.columnOrder = state.columnOrder;
    }
    if (Object.keys(state.columnSizing).length > 0) {
      tableState.columnSizing = state.columnSizing;
    }
    if (state.pagination !== undefined && state.pagination !== null) {
      tableState.pagination = state.pagination;
    }
    if (state.density !== undefined && state.density !== null) {
      tableState.density = state.density;
    }

    if (Object.keys(tableState).length > 0) {
      sessionStorage.setItem('stateListaFiis', JSON.stringify(tableState));
      handleSaveLayout(JSON.stringify(tableState));
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: lista,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enableRowActions: false,
    columnFilterDisplayMode: 'popover',
    layoutMode: 'grid',
    initialState: JSON.parse(sessionStorage.getItem('stateListaFiis')) || {
      density: 'compact',
      pagination: { 
          pageSize: 15 
      },
      defaultColumnState,
      columnVisibility: {}      
    },  
    localization: MRT_Localization_PT_BR,
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
        >
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
            onClick={saveColumnStateToSessionStorage}
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
      </div>
    );
  }
  
  export default ListaFIIs;
  
