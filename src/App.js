import './App.css';
import { Box, Container, CssBaseline } from '@mui/material';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from './config/theme';
import BarraNavegacao from './components/BarraNavegacao';
import Footer from './components/Footer';
import { BrowserRouter } from 'react-router-dom';
import Rotas from './components/Rotas';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createAppTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <BarraNavegacao check={darkMode} change={() => setDarkMode(!darkMode)} />
          <Container maxWidth="xl" sx={{ flex: 1 }}>
            <Rotas />
          </Container>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
