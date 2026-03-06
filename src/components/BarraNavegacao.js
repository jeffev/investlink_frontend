import { useState, useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Divider, Switch } from '@mui/material/';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ListItemIcon, ListItemText, ListItemButton, List } from '@mui/material/';
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  TrendingUpOutlined,
  StarOutlined,
  ApartmentOutlined,
  FavoriteOutlined,
  SentimentSatisfiedOutlined,
  AccountBalanceWalletOutlined,
  HelpOutlineOutlined,
} from '@mui/icons-material';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/LOGO.png';

const DRAWER_WIDTH = 250;

function BarraNavegacao({ check, change }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isUserLoggedIn = !!sessionStorage.getItem('user');

  const handleLogout = useCallback(() => {
    authService.logout();
    navigate('/login');
  }, [navigate]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
            <img src={Logo} alt="InvestLink" style={{ height: 36 }} />
            <Typography variant="h6" component="div">
              Invest Link
            </Typography>
          </Box>
          <FormControlLabel
            control={<Switch color="secondary" onChange={change} checked={check} />}
            label="Modo escuro"
          />
          {isUserLoggedIn ? (
            <Button color="secondary" variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="secondary" component={Link} to="/login" variant="contained">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={open} anchor="left" onClose={() => setOpen(false)}>
        <div style={{ width: DRAWER_WIDTH }} onClick={() => setOpen(false)}>
          <List>
            <ListItemButton component={Link} to="/">
              <ListItemIcon><HomeOutlined /></ListItemIcon>
              <ListItemText primary="Invest Link" />
            </ListItemButton>
            <Divider />
            <ListItemButton component={Link} to="/listaAcoes">
              <ListItemIcon><TrendingUpOutlined /></ListItemIcon>
              <ListItemText primary="Lista de ações" />
            </ListItemButton>
            <ListItemButton component={Link} to="/favoritas">
              <ListItemIcon><StarOutlined /></ListItemIcon>
              <ListItemText primary="Favoritas" />
            </ListItemButton>
            <ListItemButton component={Link} to="/glossario-acoes">
              <ListItemIcon><HelpOutlineOutlined /></ListItemIcon>
              <ListItemText primary="Glossário de ações" />
            </ListItemButton>
            <Divider />
            <ListItemButton component={Link} to="/listaFiis">
              <ListItemIcon><ApartmentOutlined /></ListItemIcon>
              <ListItemText primary="Lista de FIIs" />
            </ListItemButton>
            <ListItemButton component={Link} to="/favoritosFiis">
              <ListItemIcon><FavoriteOutlined /></ListItemIcon>
              <ListItemText primary="FIIs favoritos" />
            </ListItemButton>
            <Divider />
            <ListItemButton component={Link} to="/sentimento">
              <ListItemIcon><SentimentSatisfiedOutlined /></ListItemIcon>
              <ListItemText primary="Sentimento de mercado" />
            </ListItemButton>
            <Divider />
            <ListItemButton component={Link} to="/minhaCarteira">
              <ListItemIcon><AccountBalanceWalletOutlined /></ListItemIcon>
              <ListItemText primary="Minha carteira" />
            </ListItemButton>
          </List>
        </div>
      </Drawer>
    </Box>
  );
}

export default BarraNavegacao;
