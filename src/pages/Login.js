import { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Logo from '../assets/LOGO.png';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { Alert, Backdrop } from '@mui/material';

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ login: false, password: false });
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const login = data.get('login');
    const password = data.get('password');

    const errors = { login: !login, password: !password };
    setFieldErrors(errors);
    if (errors.login || errors.password) return;

    setLoading(true);

    try {
      const response = await authService.login(login, password);

      if (response.status === 200) {
        setError('');
        setLoading(false);
        navigate('/home');
      } else {
        setError('Usuário ou senha inválidos');
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setError('Erro ao fazer login');
      setLoading(false);
    }
  }, [navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={Logo} style={{ width: '170px', height: '170px' }} alt="Investlink" />

        <Paper elevation={3} sx={{ p: 4, mt: 2, width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Usuário"
              name="login"
              autoComplete="login"
              autoFocus
              error={fieldErrors.login}
              helperText={fieldErrors.login ? 'Campo obrigatório' : ''}
              variant="standard"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              error={fieldErrors.password}
              helperText={fieldErrors.password ? 'Campo obrigatório' : ''}
              name="password"
              label="Senha"
              type="password"
              id="password"
              variant="standard"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
            >
              Entrar
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" color="secondary">
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/registrar" variant="body2" color="secondary">
                  Não tem uma conta? Criar
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
