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

### Authentication Configuration

**By default, authentication is disabled** (`AUTH_ENABLED=false`). This is ideal for personal use where you want to skip login friction.

#### Modes

**Personal/Local Mode** (default, `AUTH_ENABLED=false`):
- All CRUD endpoints are accessible without authentication
- No token validation required
- Use `GUEST_USER_ID` to specify which user ID to default to
- Perfect for single-user local app

**Multi-User/Production Mode** (`AUTH_ENABLED=true`):
- All CRUD endpoints require a valid Firebase ID token in the `Authorization: Bearer <token>` header
- Tokens are validated server-side
- Endpoints verify resource ownership (user can only access their own data)
- Recommended for shared or cloud deployments

#### Example: Using Guest Mode

Default `.env`:
```env
AUTH_ENABLED=false
GUEST_USER_ID=1
```

Request without token (allowed when `AUTH_ENABLED=false`):
```bash
curl http://localhost:3000/expense/getDespesasMensaisList/1
```

#### Example: Enabling Authentication

`.env`:
```env
AUTH_ENABLED=true
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
```

Request with token (required when `AUTH_ENABLED=true`):
```bash
curl -H "Authorization: Bearer <firebase-id-token>" http://localhost:3000/expense/getDespesasMensaisList/1
```

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

