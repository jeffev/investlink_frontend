import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography color="primary" align="center">
        &copy; 2025 Invest Link. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
