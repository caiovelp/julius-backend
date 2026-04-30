# Julius Backend

Personal finance management API built with Node.js, Express, and SQLite.

## Features

- User authentication and management
- Wallet (Carteira) management
- Expense tracking (Despesa)
- Income tracking (Receita)
- Category management for expenses
- Bank account management
- Financial objectives tracking

## Tech Stack

- **Runtime**: Node.js (v22.21.0)
- **Framework**: Express 4.18.2
- **Database**: SQLite 3 (via Sequelize ORM)
- **Auth**: Firebase
- **Development**: Nodemon (hot reload)

## Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Server runs on `http://localhost:3000`

### Project Structure

```
/
├── config/
│   └── db.js              # Database configuration (SQLite)
├── controllers/           # Request handlers
│   ├── UsuarioController.js
│   ├── CarteiraController.js
│   ├── DespesaController.js
│   └── ...
├── models/               # Sequelize ORM models
├── routes/               # API routes
├── services/             # Business logic
├── server.js             # Main app entry
└── julius.db             # SQLite database (auto-created)
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/users/createUser` | Create user |
| POST | `/users/loginUser` | Login user |
| GET | `/users/getUserById/:id` | Get user by ID |
| GET | `/wallets/getCarteiraByUserId/:id` | Get user wallets |
| POST | `/expense/createDespesa/:walletId` | Create expense |
| GET | `/expense/getDespesasMensaisList/:carteiraId` | List monthly expenses |
| POST | `/credit/createReceita` | Create income |
| GET | `/category/getCategoriasByWalletId/:carteiraId` | Get categories |

## Environment

- Database: SQLite file-based (`julius.db`)
- CORS: Enabled
- Port: 3000

## Notes

- Database syncs automatically on startup
- All models are auto-created via Sequelize
- Frontend runs on port 3001 and connects to this API on port 3000

