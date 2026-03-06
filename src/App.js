import './App.css';
import { Container } from '@mui/material';
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
      <BrowserRouter>
        <BarraNavegacao check={darkMode} change={() => setDarkMode(!darkMode)} />
        <Container maxWidth="xl">
          <Rotas />
        </Container>
      </BrowserRouter>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
