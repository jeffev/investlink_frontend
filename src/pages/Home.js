import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        Bem-vindo ao InvestLink
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Sua plataforma de análise de investimentos brasileiros
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" component={Link} to="/listaAcoes">
          Ver Ações
        </Button>
        <Button variant="contained" component={Link} to="/listaFiis">
          Ver FIIs
        </Button>
        <Button variant="outlined" component={Link} to="/favoritas">
          Favoritas
        </Button>
      </Stack>
    </Box>
  );
}

export default Home;
