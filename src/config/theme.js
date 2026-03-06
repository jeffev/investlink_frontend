import { createTheme } from '@mui/material/styles';

export function createAppTheme(darkMode) {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#0d47a1' },
      secondary: { main: '#e65100' },
      success: { main: '#2e7d32' },
      error: { main: '#c62828' },
      background: darkMode
        ? { default: '#121212', paper: '#1e1e1e' }
        : { default: '#f5f5f5', paper: '#ffffff' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: darkMode
              ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)'
              : 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          },
        },
      },
    },
  });
}
