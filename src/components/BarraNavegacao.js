import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {
  HomeOutlined,
  LightbulbOutlined,
  TrendingUpOutlined,
  StarOutlined,
  ApartmentOutlined,
  FavoriteOutlined,
  AccountBalanceWalletOutlined,
  MenuBookOutlined,
  AdminPanelSettingsOutlined,
  AccountCircleOutlined,
  CompareArrowsOutlined,
  FeedOutlined,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import authService from '../services/auth.service';
import StockService from '../services/stock.service';
import Logo from '../assets/LOGO.png';

const DRAWER_WIDTH = 280;

/**
 * A navegação inteira em um lugar só.
 *
 * Antes, todo destino do produto ficava atrás de um ícone de hambúrguer —
 * inclusive numa tela de 3440px, onde sobrava espaço para mostrar tudo. Quem
 * chegava na home não via que existiam Oportunidades, Carteira ou Comparar
 * sem abrir uma gaveta.
 *
 * A mesma estrutura alimenta a barra do topo e a gaveta do celular, então não
 * há como um item existir num lugar e sumir no outro — foi assim que
 * "/sentimento", que nunca teve rota nem página, ficou no menu levando a uma
 * tela em branco.
 */
const NAV = [
  { label: 'Início', to: '/', icon: <HomeOutlined /> },
  { label: 'Oportunidades', to: '/oportunidades', icon: <LightbulbOutlined /> },
  {
    label: 'Ações',
    icon: <TrendingUpOutlined />,
    children: [
      { label: 'Lista de ações', to: '/listaAcoes', icon: <TrendingUpOutlined /> },
      { label: 'Favoritas', to: '/favoritas', icon: <StarOutlined /> },
    ],
  },
  {
    label: 'FIIs',
    icon: <ApartmentOutlined />,
    children: [
      { label: 'Lista de FIIs', to: '/listaFiis', icon: <ApartmentOutlined /> },
      { label: 'FIIs favoritos', to: '/favoritosFiis', icon: <FavoriteOutlined /> },
    ],
  },
  {
    label: 'Carteira',
    to: '/portfolio',
    icon: <AccountBalanceWalletOutlined />,
  },
  {
    label: 'Ferramentas',
    icon: <CompareArrowsOutlined />,
    children: [
      { label: 'Comparar ativos', to: '/comparar', icon: <CompareArrowsOutlined /> },
      { label: 'Notícias', to: '/noticias', icon: <FeedOutlined /> },
      { label: 'Guias', to: '/guias', icon: <MenuBookOutlined /> },
    ],
  },
];

function isActive(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

function sectionIsActive(pathname, item) {
  if (item.to) return isActive(pathname, item.to);
  return (item.children || []).some((child) => isActive(pathname, child.to));
}

function NavGroup({ item, pathname }) {
  const [anchor, setAnchor] = useState(null);
  const active = sectionIsActive(pathname, item);

  return (
    <>
      <Button
        color="inherit"
        onClick={(event) => setAnchor(event.currentTarget)}
        endIcon={<ExpandMoreIcon />}
        sx={navButtonSx(active)}
      >
        {item.label}
      </Button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 220 } } }}
      >
        {item.children.map((child) => (
          <MenuItem
            key={child.to}
            component={Link}
            to={child.to}
            selected={isActive(pathname, child.to)}
            onClick={() => setAnchor(null)}
          >
            <ListItemIcon>{child.icon}</ListItemIcon>
            <ListItemText>{child.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function navButtonSx(active) {
  return {
    px: 1.5,
    color: active ? 'primary.main' : 'text.secondary',
    fontWeight: active ? 700 : 600,
    borderRadius: 0,
    // Sublinhado em vez de fundo: a barra tem poucos pixels de altura e um
    // retângulo colorido por item vira listra de cores.
    borderBottom: '2px solid',
    borderColor: active ? 'primary.main' : 'transparent',
    '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
  };
}

function BarraNavegacao({ check, change }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isUserLoggedIn = !!sessionStorage.getItem('user');
  const isAdmin = useMemo(() => authService.isAdmin?.() ?? false, []);

  useEffect(() => {
    if (!isUserLoggedIn) return;
    StockService.getAlerts()
      .then((data) => setAlertCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, [isUserLoggedIn]);

  const handleLogout = useCallback(() => {
    setAccountAnchor(null);
    authService.logout();
    navigate('/login');
  }, [navigate]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            edge="start"
            aria-label="Abrir menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'text.primary',
              mr: 2,
            }}
          >
            <img src={Logo} alt="" style={{ height: 30 }} />
            <Typography variant="h6" component="span" sx={{ whiteSpace: 'nowrap' }}>
              Invest Link
            </Typography>
          </Box>

          {isUserLoggedIn && (
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'stretch',
                gap: 0.5,
                flexGrow: 1,
                alignSelf: 'stretch',
              }}
            >
              {NAV.map((item) =>
                item.children ? (
                  <NavGroup key={item.label} item={item} pathname={pathname} />
                ) : (
                  <Button
                    key={item.to}
                    component={Link}
                    to={item.to}
                    color="inherit"
                    sx={navButtonSx(isActive(pathname, item.to))}
                  >
                    {item.label}
                  </Button>
                )
              )}
            </Box>
          )}

          <Box sx={{ flexGrow: isUserLoggedIn ? 0 : 1 }} />

          {isUserLoggedIn && (
            <Tooltip title={alertCount > 0 ? `${alertCount} alertas de preço` : 'Sem alertas'}>
              {/* Sempre presente, mesmo zerado: item que aparece e some faz a
                  barra dançar e esconde que o recurso existe. */}
              <IconButton component={Link} to="/favoritas" aria-label="Alertas de preço">
                <Badge badgeContent={alertCount} color="error">
                  <NotificationsOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={check ? 'Usar tema claro' : 'Usar tema escuro'}>
            <IconButton onClick={change} aria-label="Alternar tema">
              {check ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>

          {isUserLoggedIn ? (
            <>
              <Tooltip title="Conta">
                <IconButton
                  onClick={(event) => setAccountAnchor(event.currentTarget)}
                  aria-label="Conta"
                >
                  <AccountCircleOutlined />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={accountAnchor}
                open={Boolean(accountAnchor)}
                onClose={() => setAccountAnchor(null)}
                slotProps={{ paper: { sx: { minWidth: 200 } } }}
              >
                <MenuItem
                  component={Link}
                  to="/perfil"
                  onClick={() => setAccountAnchor(null)}
                >
                  <ListItemIcon><AccountCircleOutlined /></ListItemIcon>
                  <ListItemText>Meu perfil</ListItemText>
                </MenuItem>
                {isAdmin && (
                  <MenuItem
                    component={Link}
                    to="/admin"
                    onClick={() => setAccountAnchor(null)}
                  >
                    <ListItemIcon><AdminPanelSettingsOutlined /></ListItemIcon>
                    <ListItemText>Admin</ListItemText>
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutOutlinedIcon /></ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            // Escondido na própria tela de login: um botão "Login" ao lado do
            // formulário de login não leva a lugar nenhum novo.
            pathname !== '/login' && (
              <Button component={Link} to="/login" variant="contained">
                Login
              </Button>
            )
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} anchor="left" onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: DRAWER_WIDTH }} onClick={() => setDrawerOpen(false)}>
          <List>
            {NAV.map((item) =>
              item.children ? (
                <Box key={item.label}>
                  <ListSubheader sx={{ bgcolor: 'transparent', lineHeight: '36px' }}>
                    {item.label}
                  </ListSubheader>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.to}
                      component={Link}
                      to={child.to}
                      selected={isActive(pathname, child.to)}
                    >
                      <ListItemIcon>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                  <Divider sx={{ my: 1 }} />
                </Box>
              ) : (
                <ListItemButton
                  key={item.to}
                  component={Link}
                  to={item.to}
                  selected={isActive(pathname, item.to)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default BarraNavegacao;
