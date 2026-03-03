# InvestLink Frontend

Interface web do InvestLink para análise de ações do IBXX e Fundos de Investimento Imobiliário (FIIs).

## Stack

- React 18.3.1
- Material-UI 5.15.16
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

```bash
npm test
```

Executa os testes com Jest + React Testing Library. Cobertura atual: 5 suites, 26 testes.

## Páginas

| Rota             | Página            | Acesso       |
|------------------|-------------------|--------------|
| `/login`         | Login             | Público      |
| `/register`      | Registro          | Público      |
| `/`              | Home              | Autenticado  |
| `/acoes`         | Lista de Ações    | Autenticado  |
| `/favoritas`     | Ações Favoritas   | Autenticado  |
| `/fiis`          | Lista de FIIs     | Autenticado  |
| `/fiis-favoritos`| FIIs Favoritos    | Autenticado  |

## Estrutura

```
frontend/
├── public/
└── src/
    ├── components/      → BarraNavegacao, Footer, Rotas
    ├── pages/           → Login, Register, Home, ListaAcoes,
    │                      Favoritas, ListaFiis, FiisFavoritos
    └── services/        → auth.service.js, stock.service.js,
                           fii.service.js, userLayout.service.js
```

## Serviços

| Arquivo                 | Responsabilidade                              |
|-------------------------|-----------------------------------------------|
| `auth.service.js`       | Login, logout, registro, token JWT, perfil    |
| `stock.service.js`      | Listagem e favoritos de ações                 |
| `fii.service.js`        | Listagem e favoritos de FIIs                  |
| `userLayout.service.js` | Salvar e recuperar layout das tabelas         |

## Funcionalidades

- **Tema Dark/Light** — alternância de tema persistida por sessão
- **Salvar Layout** — colunas visíveis e ordem salvas por página no backend
- **Filtros** — filtro em todos os campos das tabelas de ações e FIIs
- **Favoritos** — preço teto e alvo com indicação visual de compra/venda
- **Autenticação JWT** — token armazenado em `sessionStorage`, expira em 3h
