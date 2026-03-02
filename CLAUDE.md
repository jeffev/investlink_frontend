# Frontend InvestLink

React 18.3.1 · Material-UI 5.15.16 · Axios · React Router 6 · JavaScript (sem TypeScript)

## Comandos essenciais

```bash
cd /d/Investlink/frontend

npm install        # instalar dependências
npm start          # dev server
npm run build      # build produção
npm test           # testes (--silent para suprimir output)
npm run lint       # eslint
```

## Estrutura
```
src/
  pages/
    ListaAcoes.js      (596 linhas) → listagem de ações com filtros e favoritos
    Favoritas.js       (631 linhas) → gestão de ações favoritas
    ListaFiis.js       → listagem de FIIs
    FiisFavoritos.js   → FIIs favoritos
    Login.js           → autenticação
    Register.js        → cadastro
  services/
    auth.service.js        → login, logout, token JWT no localStorage
    stock.service.js       → CRUD de ações
    fii.service.js         → CRUD de FIIs
    userLayout.service.js  → salvar/carregar layout de tabelas
  App.js  → rotas com React Router 6
```

## Padrão de chamada à API

```javascript
// Os serviços já têm a URL base configurada
// NÃO hardcode URLs — use as funções dos services

import { getStocks } from '../services/stock.service';

useEffect(() => {
  getStocks().then(data => setStocks(data));
}, []);
```

## Autenticação

```javascript
import authService from '../services/auth.service';

// Token é armazenado no localStorage automaticamente pelo auth.service
// Para verificar se está logado:
authService.getCurrentUser()  // retorna null se não logado
```

## Material-UI

```javascript
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Box, Typography } from '@mui/material';
// Tema padrão MUI 5 — sem customização de tema global
```

## Gotchas
- Componentes grandes (Favoritas.js 631 linhas, ListaAcoes.js 596 linhas) — leia só a seção relevante
- Sem TypeScript — PropTypes não são usados
- Build gera pasta `build/` (subida para GHCR via Dockerfile com nginx)
- `REACT_APP_API_URL` é injetado no build via Docker build-arg (GitHub variable)
