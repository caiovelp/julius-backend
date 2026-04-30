[Architecture Software Documentation](https://docs.google.com/document/d/1s4usCP6rROECnTqg97EUGO6W2PARVF5A2OdLVb2ksm0/edit?usp=sharing)
                                                         |

This is a project developed in college for the Software Project course, and it was developed in conjunction with the [julius-frontend](https://github.com/caiovelp/julius-frontend).

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

### Environment Variables

Copy [.env.example](.env.example) to `.env` and fill in the Firebase values before starting the server.

Required variables:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

Optional:

- `FIREBASE_MEASUREMENT_ID`

### Development Server

```bash
npm start
```

Server runs on `http://localhost:3000`

The start command runs a lightweight secret scan before booting the server.

To run the scan directly:

```bash
npm run check:secrets
```

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
- Firebase config: loaded from environment variables via `.env`

## Notes

- Database syncs automatically on startup
- All models are auto-created via Sequelize
- Frontend runs on port 3001 and connects to this API on port 3000
- Never commit `.env` or any Firebase service-account JSON file
