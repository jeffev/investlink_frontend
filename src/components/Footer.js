import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { Link as MuiLink, Stack } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 3 }}
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="caption" color="text.secondary">
          {/* Era "© 2025" fixo, escrito em cor primária como se fosse um link.
              O ano vem do relógio; o aviso é o que realmente importa aqui. */}
          © {new Date().getFullYear()} Invest Link
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Conteúdo informativo — não é recomendação de investimento.
        </Typography>
        <MuiLink
          component={Link}
          to="/guias"
          variant="caption"
          color="text.secondary"
        >
          Como usar
        </MuiLink>
      </Stack>
    </Box>
  );
}

export default Footer;
