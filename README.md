# LinkForge - Full Stack URL Management Platform

LinkForge is a full-stack URL management platform built for teams and builders who need more than basic link shortening. It provides authenticated URL creation, expiration controls, click tracking, and Redis-backed redirect acceleration, making it suitable for campaign links, product growth funnels, and internal analytics workflows.

Designed as a portfolio-grade engineering project, LinkForge demonstrates production-oriented backend patterns (retry logic, containerized services, JWT security, cache-assisted reads) with a modern React frontend.

## Why LinkForge

Traditional short links solve only one problem: URL length. LinkForge focuses on real operational needs:

- Fast redirects under repeated traffic using Redis cache
- Protected URL creation with JWT-based authentication
- Expiring links for time-bound campaigns and sharing windows
- Click tracking for lightweight engagement visibility
- Docker-based service composition for reproducible environments

## Key Features

- User registration and login with password hashing (`bcrypt`) and JWT auth
- Auth-protected short URL generation
- Optional expiration date per short link
- Public redirect endpoint with cache hit/miss strategy (Redis + PostgreSQL fallback)
- Click count increment on each redirect
- Auto-initialized PostgreSQL schema at server startup
- React dashboard with:
	- login/register flows
	- URL creation form
	- copy-to-clipboard support
	- local fallback behavior when list endpoint is unavailable
- Containerized backend stack via Docker Compose (API + PostgreSQL + Redis)

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express
- JWT (`jsonwebtoken`)
- `bcrypt`
- `nanoid`

### Data Layer

- PostgreSQL (`pg`)
- Redis (`redis`)

### DevOps / Tooling

- Docker + Docker Compose
- Nodemon
- Morgan / CORS / dotenv

## Architecture Overview

LinkForge uses a service-oriented local architecture:

1. Frontend (`frontend/`) serves a single-page app for auth and URL workflows.
2. Backend API (`src/`) exposes auth and URL endpoints.
3. PostgreSQL stores users and URL records (including click counts and expirations).
4. Redis caches short-code lookups to accelerate repeated redirects.

### Redirect Flow

1. Client requests `GET /:shortCode`
2. API checks Redis first
3. On cache hit: redirect immediately and increment click counter
4. On cache miss: fetch from PostgreSQL, validate expiration, cache result, redirect

This cache-aside pattern reduces database pressure on high-frequency links and improves perceived latency.

## Installation (Local Development)

## Option A: Docker-first backend + local frontend (recommended)

### 1. Clone and install root dependencies

```bash
git clone <your-repo-url>
cd url-shortener-project
npm install
```

### 2. Start backend services

```bash
docker-compose up --build
```

Backend API runs on `http://localhost:5000`

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Option B: Fully local backend (without Docker)

You need locally running PostgreSQL and Redis. Then configure environment variables in `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=myapp
JWT_SECRET=your_secret
REDIS_URL=redis://localhost:6379
DB_MAX_RETRIES=15
DB_RETRY_DELAY_MS=2000
```

Run backend:

```bash
npm install
npm run dev
```

Run frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

## Usage Guide

1. Open frontend at `http://localhost:5173`
2. Register a new account
3. Login to receive authenticated access
4. Create a short URL from the dashboard
5. (Optional) set an expiration date
6. Copy and open the generated short URL
7. Observe redirect behavior and click increments

Note: The backend currently exposes URL creation and redirect endpoints. Frontend includes fallback behavior for listing URLs when `GET /api/urls` is not present.

## API Endpoints

Base URL: `http://localhost:5000`

## Health / Utility

- `GET /` - API health message
- `GET /test-db` - database connectivity test

## Authentication

### Register

- `POST /api/auth/register`

Request:

```json
{
	"email": "user@example.com",
	"password": "StrongPassword123"
}
```

Response (`201`):

```json
{
	"id": 1,
	"email": "user@example.com"
}
```

### Login

- `POST /api/auth/login`

Request:

```json
{
	"email": "user@example.com",
	"password": "StrongPassword123"
}
```

Response (`200`):

```json
{
	"token": "<jwt-token>"
}
```

## URL Management

### Create Short URL (Protected)

- `POST /api/urls`
- Headers: `Authorization: Bearer <token>`

Request:

```json
{
	"original_url": "https://www.example.com/very/long/path",
	"expires_at": "2026-12-31T23:59:59.000Z"
}
```

Response (`201`):

```json
{
	"id": 12,
	"original_url": "https://www.example.com/very/long/path",
	"short_code": "a1B2c3",
	"user_id": 1,
	"click_count": 0,
	"expires_at": "2026-12-31T23:59:59.000Z",
	"created_at": "2026-03-22T10:00:00.000Z"
}
```

### Redirect

- `GET /:shortCode`
- Example: `GET /a1B2c3`

Behavior:

- Redirects to original URL if valid
- Returns `404` if code does not exist
- Returns `410` if link is expired

```

## Folder Structure

```text
url-shortener-project/
|- src/
|  |- app.js                 # Express app wiring and route mounting
|  |- server.js              # Bootstrap, DB retry, schema initialization
|  |- config/
|  |  |- db.js               # PostgreSQL pool config
|  |  |- redis.js            # Redis client config
|  |- controllers/
|  |  |- authController.js   # register/login handlers
|  |  |- urlController.js    # create + redirect logic
|  |- middleware/
|  |  |- authMiddleware.js   # JWT verification
|  |- routes/
|  |  |- authRoutes.js
|  |  |- urlRoutes.js
|  |- models/                # reserved for model abstractions
|  |- utils/                 # shared utilities (future)
|- frontend/
|  |- src/
|  |  |- pages/              # Login, Register, Dashboard
|  |  |- components/         # Navbar, forms, list views
|  |  |- services/           # Axios/API clients
|  |  |- context/            # Auth context/state
|  |- index.html
|- docker-compose.yml        # app + postgres + redis orchestration
|- Dockerfile                # backend container image
|- package.json              # backend scripts and dependencies
```

## Roadmap

- Add `GET /api/urls` for first-class server-side URL listing
- Add pagination, filtering, and sorting for large link catalogs
- Add custom aliases (`/my-campaign`) and collision handling
- Add role-based access control and team workspaces
- Add QR code generation per short link
- Add analytics dashboard (time-series clicks, referrers, geolocation)
- Add rate limiting and abuse prevention
- Add test suite (unit, integration, API contract)
- Add CI/CD pipeline with lint, test, and image publishing

## Contributing

Contributions are welcome. To keep quality high:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feat/your-feature
```

3. Commit with clear, scoped messages
4. Push and open a pull request.
5. In the pull request description, include: problem statement, implementation details, testing notes, and screenshots for UI changes.

Recommended standards:

- Keep PRs focused and reviewable
- Avoid breaking API contracts without documentation
- Prefer explicit error handling over silent failures

## License

This project is licensed under the ISC License.
