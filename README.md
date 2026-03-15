# InvestLink Frontend

Interface web do InvestLink para análise de ações do IBXX e Fundos de Investimento Imobiliário (FIIs).

## Stack

- React 18.3.1
- Material-UI 5.15.16 + Material React Table 2
- Axios
- React Router 6
- JWT (sessão via `sessionStorage`)

## Execução local (sem Docker)

```bash
cd frontend
npm install
npm start
```

A aplicação sobe em `http://localhost:3000`.

Configure a variável de ambiente para apontar para o backend:

```env
# .env
REACT_APP_API_URL=http://localhost:5000/v1/
```

## Execução com Docker

Na raiz do monorepo:

```bash
docker compose up --build frontend
```

A aplicação é servida via Nginx na porta 3000.

## Build de produção

```bash
npm run build
```

## Testes

### Unitários / Integração (Jest + React Testing Library)

```bash
npm test -- --watchAll=false
```

Cobertura atual: 10 suites, 95 testes.

### E2E (Playwright)

```bash
# Instalar browsers (primeira vez)
npx playwright install chromium

# Rodar todos os testes E2E
npm run e2e

# Ver relatório HTML
npm run e2e:report
```

Os testes E2E usam `page.route()` para mockar as chamadas de API — **não precisam de backend rodando**.

Spec files em `e2e/`: autenticação, dashboard, lista de ações, favoritas, portfolio.

## Páginas

| Rota              | Página             | Acesso       |
|-------------------|--------------------|--------------|
| `/login`          | Login              | Público      |
| `/registrar`      | Registro           | Público      |
| `/`               | Dashboard (Home)   | Autenticado  |
| `/listaAcoes`     | Lista de Ações     | Autenticado  |
| `/acao/:ticker`   | Detalhe da Ação    | Autenticado  |
| `/favoritas`      | Ações Favoritas    | Autenticado  |
| `/listaFiis`      | Lista de FIIs      | Autenticado  |
| `/fiisFavoritos`  | FIIs Favoritos     | Autenticado  |
| `/portfolio`      | Minha Carteira     | Autenticado  |

## Estrutura

```
frontend/
├── e2e/                     → testes E2E (Playwright)
│   ├── helpers/mockApi.js   → mocks centralizados de API
│   └── *.spec.js
├── public/
└── src/
    ├── columns/             → definição de colunas das tabelas (stockColumns, fiiColumns)
    ├── components/
    │   ├── Common/          → FeedbackUI (LoadingBackdrop, FeedbackSnackbar)
    │   └── Table/           → PriceCell, TableToolbar (componentes reutilizáveis)
    ├── pages/               → Login, Register, Home, ListaAcoes, AcaoDetalhe,
    │                          Favoritas, ListaFiis, FiisFavoritos, Portfolio
    ├── services/            → auth, stock, fii, portfolio, userLayout
    └── utils/               → tableLayout.js
```

## Serviços

| Arquivo                  | Responsabilidade                                      |
|--------------------------|-------------------------------------------------------|
| `auth.service.js`        | Login, logout, registro, token JWT, perfil            |
| `stock.service.js`       | Listagem, favoritos, previsões ML, alertas de preço   |
| `fii.service.js`         | Listagem e favoritos de FIIs                          |
| `portfolio.service.js`   | CRUD de posições e resumo da carteira                 |
| `userLayout.service.js`  | Salvar e recuperar layout das tabelas                 |

## Funcionalidades

- **Dashboard** — cards de favoritas, top picks ML (BARATA), alertas de preço e resumo da carteira
- **Detalhe de ação** — indicadores financeiros completos e previsão do modelo ML
- **Busca rápida** — busca por ticker ou nome da empresa com debounce de 400ms
- **Filtros por chip** — BARATA, DY > 8%, Top Magic Formula (ações); DY > 8%, P/VP < 1, Alta Liquidez (FIIs)
- **Portfólio** — adicionar/editar/remover posições, P&L em tempo real
- **Alertas de preço** — badge no menu quando alguma favorita atingiu o preço teto ou alvo
- **Tema Dark/Light** — alternância de tema persistida por sessão
- **Salvar Layout** — colunas visíveis e ordem salvas por página no backend
- **Autenticação JWT** — token armazenado em `sessionStorage`, expira em 3h
- **Export CSV** — exportação das tabelas para CSV com separador `;`
