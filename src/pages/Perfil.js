import React, { useState } from "react";
import {
  Alert,
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

const Perfil = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({ severity: "error", message: "A nova senha e a confirmação não coincidem." });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({ severity: "error", message: "A nova senha deve ter pelo menos 6 caracteres." });
      return;
    }

    const userId = authService.getCurrentUserId();
    if (!userId) {
      setFeedback({ severity: "error", message: "Não foi possível identificar o usuário. Faça login novamente." });
      return;
    }

    setLoading(true);
    try {
      await UserService.changePassword(userId, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setFeedback({ severity: "success", message: "Senha alterada com sucesso!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setFeedback({ severity: "error", message: "Erro ao alterar senha. Verifique a senha atual." });
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
          {feedback && (
            <Alert severity={feedback.severity} sx={{ mb: 2 }}>
              {feedback.message}
            </Alert>
          )}
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
    </Box>
  );
};

export default Perfil;
