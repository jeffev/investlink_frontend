import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import authService from "../services/auth.service";
import UserService from "../services/user.service";
import { FeedbackSnackbar } from "../components/Common/FeedbackUI";

function isStrongPassword(pwd) {
  return pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd);
}

const Perfil = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbar, setSnackbar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar(null);

    if (newPassword !== confirmPassword) {
      setSnackbar({ children: "A nova senha e a confirmação não coincidem.", severity: "error" });
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setSnackbar({
        children: "A senha deve ter ao menos 8 caracteres, 1 maiúscula e 1 número.",
        severity: "warning",
      });
      return;
    }

    const userId = authService.getCurrentUserId();
    if (!userId) {
      setSnackbar({ children: "Não foi possível identificar o usuário. Faça login novamente.", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      await UserService.changePassword(userId, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSnackbar({ children: "Senha alterada com sucesso!", severity: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setSnackbar({ children: "Erro ao alterar senha. Verifique a senha atual.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Meu Perfil
      </Typography>

      <Card variant="outlined">
        <CardHeader
          title="Alterar Senha"
          titleTypographyProps={{ variant: "subtitle1", fontWeight: 700 }}
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Senha atual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
            />
            <TextField
              label="Nova senha"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
            />
            <TextField
              label="Confirmar nova senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? "Salvando..." : "Alterar Senha"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <FeedbackSnackbar snackbar={snackbar} onClose={() => setSnackbar(null)} />
    </Box>
  );
};

export default Perfil;
