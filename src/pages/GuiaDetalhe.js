import { Box, Button, Divider, Typography } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Link, useParams } from 'react-router-dom';
import GUIAS_MAP from '../components/Guias/index';

export default function GuiaDetalhe() {
  const { slug } = useParams();
  const guia = GUIAS_MAP[slug];

  if (!guia) {
    return (
      <Box sx={{ py: 6, maxWidth: 860, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Guia nao encontrado
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          O guia "{slug}" nao existe ou foi removido.
        </Typography>
        <Button component={Link} to="/guias" variant="contained" startIcon={<ArrowBackOutlinedIcon />}>
          Voltar aos Guias
        </Button>
      </Box>
    );
  }

  const GuiaComponent = guia.component;

  return (
    <Box sx={{ py: 3, maxWidth: 860, mx: 'auto' }}>
      <Button
        component={Link}
        to="/guias"
        variant="text"
        startIcon={<ArrowBackOutlinedIcon />}
        sx={{ mb: 2 }}
      >
        Voltar aos Guias
      </Button>
      <Divider sx={{ mb: 1 }} />
      <GuiaComponent />
    </Box>
  );
}
