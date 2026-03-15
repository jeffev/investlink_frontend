import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StockService from "../services/stock.service";
import FIIService from "../services/fii.service";
import UserService from "../services/user.service";
import { FeedbackSnackbar } from "../components/Common/FeedbackUI";

function MaintenanceCard({ label, onAction, loading }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography fontWeight={500}>{label}</Typography>
        <Button
          variant="contained"
          onClick={onAction}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? "Atualizando..." : "Atualizar"}
        </Button>
      </CardContent>
    </Card>
  );
}

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    UserService.getUsers()
      .then(setUsers)
      .catch(() => setSnackbar({ children: "Erro ao carregar usuários.", severity: "error" }));
  }, []);

  const handleUpdateStocks = async () => {
    setLoadingAction("stocks");
    try {
      await StockService.updateStocks();
      setSnackbar({ children: "Ações atualizadas com sucesso!", severity: "success" });
    } catch {
      setSnackbar({ children: "Erro ao atualizar ações.", severity: "error" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateFIIs = async () => {
    setLoadingAction("fiis");
    try {
      await FIIService.updateFIIs();
      setSnackbar({ children: "FIIs atualizados com sucesso!", severity: "success" });
    } catch {
      setSnackbar({ children: "Erro ao atualizar FIIs.", severity: "error" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteUser = async (id, userName) => {
    if (!window.confirm(`Excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await UserService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSnackbar({ children: "Usuário excluído com sucesso.", severity: "success" });
    } catch {
      setSnackbar({ children: "Erro ao excluir usuário.", severity: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Painel Administrativo
      </Typography>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Manutenção do Sistema
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <MaintenanceCard
            label="Atualizar Ações"
            onAction={handleUpdateStocks}
            loading={loadingAction === "stocks"}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MaintenanceCard
            label="Atualizar FIIs"
            onAction={handleUpdateFIIs}
            loading={loadingAction === "fiis"}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Gestão de Usuários
      </Typography>
      <Card variant="outlined">
        <CardHeader
          title={`${users.length} usuário(s) cadastrado(s)`}
          titleTypographyProps={{ variant: "body2", color: "text.secondary" }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.user_name}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.profile}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteUser(user.id, user.user_name)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <FeedbackSnackbar snackbar={snackbar} onClose={() => setSnackbar(null)} />
    </Box>
  );
};

export default Admin;
