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

### Unitários (Jest + React Testing Library)

```bash
npm test -- --watchAll=false
```

### E2E (Cypress)

> **Windows:** rodar no **PowerShell** ou **CMD** — o binário do Cypress não funciona no Git Bash.

```bash
# Abre a UI interativa
npm run cy:open

# Roda todos os testes headless
npm run cy:run

# Roda um spec específico
npm run cy:run -- --spec "cypress/e2e/favoritas.cy.js"
```

Os testes E2E usam `cy.intercept()` para mockar chamadas de API — **não precisam de backend rodando**.

#### Specs disponíveis

| Arquivo              | Cenários cobertos                                      |
|----------------------|--------------------------------------------------------|
| `auth.cy.js`         | Login, logout, validações de campo, redirecionamentos  |
| `register.cy.js`     | Cadastro válido, usuário duplicado, link para login    |
| `dashboard.cy.js`    | Cards de favoritas, Top Picks ML, resumo da carteira   |
| `stocks.cy.js`       | Lista, busca, chips de filtro, favoritar, detalhe      |
| `acao-detalhe.cy.js` | Indicadores, label ML, preço em BRL, botão Voltar      |
| `favoritas.cy.js`    | Exibição, editar, remover, preço teto, salvar layout   |
| `fiis.cy.js`         | Lista, busca, chip DY, navegação para detalhe          |
| `portfolio.cy.js`    | Adicionar/remover posição, validação de modal          |

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
| `/fii/:ticker`    | Detalhe do FII     | Autenticado  |
| `/portfolio`      | Minha Carteira     | Autenticado  |

## Estrutura

```
frontend/
├── cypress/
│   ├── e2e/             → specs Cypress (um por página)
│   ├── fixtures/
│   │   └── mockData.js  → dados mockados compartilhados entre specs
│   └── support/
│       ├── commands.js  → cy.visitAuthenticated(), cy.setupMocks()
│       └── e2e.js       → ponto de entrada do support
├── public/
└── src/
    ├── columns/         → definição de colunas das tabelas (stockColumns, fiiColumns)
    ├── components/
    │   ├── Common/      → FeedbackUI (LoadingBackdrop, FeedbackSnackbar)
    │   └── Table/       → PriceCell, TableToolbar
    ├── pages/           → Login, Register, Home, ListaAcoes, AcaoDetalhe,
    │                      Favoritas, ListaFiis, FiisFavoritos, Portfolio
    ├── services/        → auth, stock, fii, portfolio, userLayout
    └── utils/           → tableLayout.js
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
- **Autenticação JWT** — token armazenado em `sessionStorage`, expira em 3h com refresh automático
- **Export CSV** — exportação das tabelas para CSV com separador `;`
