import { useState, useCallback, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import authService from '../services/auth.service';
import Logo from '../assets/LOGO.png';
import { IS_DEMO } from '../config/api';

/**
 * A porta de entrada.
 *
 * Antes: um cartão de 400px perdido no meio de uma tela preta de 3440, com o
 * logo em 170px em cima dele, campos sublinhados, botão cinza e um
 * "Esqueceu a senha?" apontando para `href="#"` — link que não leva a lugar
 * nenhum é pior que ausência de link, porque custa uma tentativa antes de
 * descobrir.
 *
 * Agora a tela diz o que o produto faz antes de pedir a senha. Quem já tem
 * conta ignora a coluna da esquerda; quem chegou pela primeira vez sabe onde
 * está.
 */

const ARGUMENTOS = [
  'Ações e FIIs pontuados contra os pares do próprio setor, não contra o mercado inteiro.',
  'Cada indicação vem com o argumento a favor e o alerta contra, lado a lado.',
  'Fundamento auditado da CVM, com a data do balanço que gerou cada número.',
];

// Passado esse tempo sem resposta, quase sempre é o servidor gratuito acordando.
const AVISO_SERVIDOR_DORMINDO_MS = 4000;

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ login: false, password: false });
  const navigate = useNavigate();

  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    authService.wakeUpServer();
  }, []);

  const entrar = useCallback(
    async (abrirSessao) => {
      setLoading(true);
      setIsSlow(false);
      const aviso = setTimeout(() => setIsSlow(true), AVISO_SERVIDOR_DORMINDO_MS);

      try {
        const response = await abrirSessao();

        if (response?.status === 200) {
          setError('');
          navigate('/');
        } else {
          setError('Usuário ou senha inválidos');
        }
      } catch (e) {
        console.log(e);
        setError('Erro ao fazer login');
      } finally {
        clearTimeout(aviso);
        setLoading(false);
        setIsSlow(false);
      }
    },
    [navigate]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const login = data.get('login');
      const password = data.get('password');

      const errors = { login: !login, password: !password };
      setFieldErrors(errors);
      if (errors.login || errors.password) return;

      entrar(() => authService.login(login, password));
    },
    [entrar]
  );

  return (
    <Box
      sx={{
        // Centralizado no que sobra depois da barra e do rodapé.
        minHeight: { md: 'calc(100vh - 160px)' },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        alignItems: 'center',
        gap: { xs: 4, md: 8 },
        maxWidth: 1100,
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, md: 8 },
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <img src={Logo} alt="" style={{ height: 44 }} />
          <Typography variant="h4" component="h1">
            Invest Link
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
          Encontrar uma boa oportunidade sem ler trinta e cinco colunas de
          indicador.
        </Typography>
        <Stack spacing={1.5}>
          {ARGUMENTOS.map((texto) => (
            <Box key={texto} sx={{ display: 'flex', gap: 1.5 }}>
              <CheckCircleOutlineIcon
                sx={{ color: 'primary.main', fontSize: 20, mt: '2px' }}
              />
              <Typography variant="body2" color="text.secondary">
                {texto}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, width: '100%' }}>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 2 }}>
          <img src={Logo} alt="Invest Link" style={{ height: 56 }} />
        </Box>

        <Typography variant="h6" component="h2">
          Entrar
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Use o usuário e a senha da sua conta.
        </Typography>

        {IS_DEMO && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Esta é uma demonstração. Entre como visitante, sem cadastro.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isSlow && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Acordando o servidor gratuito. Na primeira visita isso pode levar
            até um minuto.
          </Alert>
        )}

        {IS_DEMO && (
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={loading}
            onClick={() => entrar(() => authService.loginAsDemo())}
            sx={{ mb: 3 }}
          >
            Entrar como visitante
          </Button>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            id="login"
            name="login"
            label="Usuário"
            autoComplete="username"
            autoFocus
            error={fieldErrors.login}
            helperText={fieldErrors.login ? 'Campo obrigatório' : ' '}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Senha"
            type="password"
            autoComplete="current-password"
            error={fieldErrors.password}
            helperText={fieldErrors.password ? 'Campo obrigatório' : ' '}
          />
          <Button
            type="submit"
            fullWidth
            size="large"
            variant={IS_DEMO ? 'outlined' : 'contained'}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ mt: 1 }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </Box>

        {!IS_DEMO && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Não tem uma conta?{' '}
            <Box component={RouterLink} to="/registrar" sx={{ color: 'primary.main' }}>
              Criar agora
            </Box>
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
