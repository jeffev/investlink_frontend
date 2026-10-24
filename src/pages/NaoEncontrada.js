import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

/**
 * O endereço que não existe.
 *
 * Sem esta rota o React Router não casava nada e renderizava o cabeçalho, o
 * rodapé e um vazio no meio — a tela não dizia que a página não existe, e um
 * link velho ou um ticker digitado errado passavam por "o site quebrou".
 */

function NaoEncontrada() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 10,
        px: 2,
      }}
    >
      <SearchOffIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Esta página não existe
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 440 }}>
        O endereço pode ter mudado, ou o link que te trouxe até aqui está
        desatualizado.
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
        <Button component={Link} to="/oportunidades" variant="contained">
          Ver oportunidades
        </Button>
        <Button component={Link} to="/" variant="outlined">
          Voltar ao início
        </Button>
      </Stack>
    </Box>
  );
}

export default NaoEncontrada;
