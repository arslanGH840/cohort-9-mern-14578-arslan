markdown
# Vellum - Notes App

A full stack, privacy focused note taking application built as a MERN stack internship project. Users can sign up, log in, and manage their own private notes with a rich text editor. Every note is scoped to its owner, and the application is built with the same discipline expected of a real production system: layered architecture, structured logging, centralized error handling, automated testing, and static code quality analysis.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [API Overview](#api-overview)
- [Key Decisions and Trade offs](#key-decisions-and-trade-offs)
- [Code Quality](#code-quality)
- [Project Structure](#project-structure)

## Overview

Vellum lets a user sign up, log in, and manage a personal collection of notes. Core features include:

- User registration and login with JWT based authentication
- A protected dashboard showing only the logged in user's notes
- A rich text editor (bold, italic, lists) for creating and editing notes
- Search, sorting, and pagination on the notes list
- Delete confirmation to prevent accidental data loss
- A profile page showing account details

Every note operation is scoped to the authenticated user at the database query level, not just checked after the fact. Accessing or modifying another user's note returns a 404, identical to a note that does not exist at all, so ownership can never be probed by an unauthorized request.

## Architecture

The backend follows a layered architecture, separating concerns cleanly across each request:

Route -> Middleware (auth, validation) -> Controller -> Service -> Repository -> Model -> Database


- **Routes** define the URL structure and wire together the middleware chain for each endpoint.
- **Middleware** handles cross cutting concerns: authentication (JWT verification), request validation, and centralized error handling.
- **Controllers** are thin. They translate an HTTP request into a service call and shape the HTTP response. No business logic lives here.
- **Services** hold the actual business logic: checking ownership, hashing passwords, deciding what counts as a conflict or a not found case.
- **Repositories** are the only layer that talks to the database directly, through Sequelize models.

This separation means the same service logic can be tested in isolation with mocked repositories (unit tests), and the same routes can be tested end to end against a real test database (integration tests), without duplicating logic between the two.

The frontend follows a similar layering:

Page -> Feature components/hooks -> Shared UI components -> API service layer -> Axios instance


- **Shared UI components** (Button, Input, Card, Modal, Loader, EmptyState, ErrorState) hold no knowledge of any specific feature and are reused across the whole app, built on a small set of centrally defined design tokens (colors, typography, spacing) rather than one off styling choices.
- **Feature modules** (for example, `features/notes/`) own the data fetching hooks and components specific to that feature.
- **AuthContext** is the single source of truth for the current user's session, backed by a token stored in the browser and rehydrated on page load by calling the backend to confirm the token is still valid.
- A route guard component blocks unauthenticated access to protected pages on the client, while the backend's authentication middleware remains the actual security boundary.

## Tech Stack

**Backend**
- Node.js and Express
- MySQL with Sequelize ORM
- JWT for authentication, bcrypt for password hashing
- Pino for structured JSON logging
- express validator for request validation
- Mocha, Chai, Sinon, and Supertest for backend testing

**Frontend**
- React (Vite)
- Tailwind CSS with a centralized design token system
- React Router for client side routing
- React Query (TanStack Query) for server state and caching
- React Hook Form with Zod for form validation
- React Quill for rich text editing, with DOMPurify sanitizing any rendered HTML
- Jest and React Testing Library for frontend testing

**Tooling**
- Git with a main, develop, feature branch workflow and pull request review (CodeRabbit automated review plus mentor review)
- SonarCloud for static code quality analysis

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- MySQL Server (8.x)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/arslanGH840/cohort-9-mern-14578-arslan.git
cd cohort-9-mern-14578-arslan
```

### 2. Set up the database

Log in to MySQL as root and create the application databases and a dedicated user:

```sql
CREATE DATABASE notes_app_dev;
CREATE DATABASE notes_app_test;

CREATE USER 'notes_app_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON notes_app_dev.* TO 'notes_app_user'@'localhost';
GRANT ALL PRIVILEGES ON notes_app_test.* TO 'notes_app_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your real database password and a randomly generated JWT secret (see [Environment Variables](#environment-variables) below).

Run the migrations and seed a demo account with a few sample notes:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Start the backend:

```bash
npm start
```

The API will be available at `http://localhost:5000`. A health check endpoint is available at `GET /health`.

### 4. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Log in

Use the seeded demo account, or register a new one from the app itself:

Username: demo_user
Password: Demo@12345


## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the backend server listens on (default 5000) |
| `NODE_ENV` | `development`, `test`, or `production` |
| `FRONTEND_ORIGIN` | Allowed CORS origin, the frontend's URL |
| `DB_HOST` | MySQL host, usually `localhost` |
| `DB_NAME` | Database name, `notes_app_dev` for local development |
| `DB_USER` | MySQL user for the app |
| `DB_PASSWORD` | MySQL user's password |
| `JWT_SECRET` | A long, random string used to sign JWTs. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_EXPIRES_IN` | Token lifetime, for example `2h` |

Backend tests use a separate `backend/.env.test` file pointing at `notes_app_test`, so tests never touch development data.

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, for example `http://localhost:5000/api` |

## Running Tests

### Backend

```bash
cd backend
npx sequelize-cli db:migrate --env test
npm test
```

This runs the full Mocha/Chai/Sinon/Supertest suite: unit tests against mocked repositories, and integration tests that exercise real HTTP requests against the `notes_app_test` database, including cross user ownership enforcement, validation edge cases, and authentication middleware behavior with missing, malformed, expired, and forged tokens.

### Frontend

```bash
cd frontend
npm test
```

This runs the Jest and React Testing Library suite covering shared UI components, auth pages, the AuthContext session logic, the route guard, and the notes data hooks, with the API layer mocked.

## API Overview

All endpoints are prefixed with `/api`. Protected endpoints require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/auth/register` | Create a new account | No |
| POST | `/auth/login` | Log in, returns a JWT | No |
| GET | `/auth/me` | Get the current authenticated user | Yes |
| POST | `/auth/logout` | Log out | Yes |
| GET | `/notes` | List the current user's notes (supports `page`, `pageSize`, `sortBy`, `order`, `search`) | Yes |
| GET | `/notes/:id` | Get a single note by id | Yes |
| POST | `/notes` | Create a note | Yes |
| PUT | `/notes/:id` | Update a note | Yes |
| DELETE | `/notes/:id` | Delete a note | Yes |
| GET | `/health` | Health check | No |

Every response follows a consistent envelope:

```json
{ "success": true, "data": { } }
```

or on failure:

```json
{ "success": false, "error": { "message": "..." } }
```

## Key Decisions and Trade offs

**Token storage in localStorage.** The frontend stores the JWT in `localStorage` rather than an httpOnly cookie. This was a deliberate, documented trade off for the scope of this project. An httpOnly cookie is not readable by JavaScript and is therefore more resistant to XSS based token theft, while a token in `localStorage` is readable by any script running on the page. Given the project's scope and timeline, `localStorage` was chosen for simplicity, with the understanding that a production deployment handling sensitive data would likely move to an httpOnly cookie instead.

**Ownership enforced at the query level, not just checked afterward.** Every note repository function requires a `userId` argument and filters by it directly in the database query, rather than fetching a note and checking its owner in application code afterward. This makes it structurally difficult to accidentally introduce a bug that leaks another user's data.

**404, not 403, for notes you do not own.** Attempting to view, edit, or delete a note that exists but belongs to another user returns the same 404 response as a note that does not exist at all. This avoids confirming to an unauthorized requester whether a given note id exists.

**Repository calls go through the module object, not destructured imports.** Service files call `userRepository.findByUsername(...)` rather than destructuring `{ findByUsername }` at import time. This was a deliberate fix made after discovering that destructured imports prevented Sinon test stubs from taking effect, since the destructured reference is captured before a test can replace it.

**Stateless logout.** Since JWTs are stateless, the logout endpoint does not maintain a server side session to destroy. It exists to provide a consistent API contract and a stable hook for future server side token revocation, while the real effect of logging out happens on the client by discarding the stored token.

## Code Quality

Static analysis was performed with SonarCloud against the full codebase.

- Quality Gate: Passed
- Security rating: A
- Reliability rating: A
- Maintainability rating: A
- Duplications: 0.0%

An initial scan flagged a small number of reliability and maintainability issues; all were reviewed and fixed, then re-scanned to confirm a clean result. See [`docs/Sonarqube report.docx`](./docs/Sonarqube%20report.docx) (initial scan) and [`docs/sonarqube report_AfterFix.docx`](./docs/sonarqube%20report_AfterFix.docx) (after fixes) for the full before and after reports.

## Project Structure

cohort-9-mern-14578-arslan/
├── backend/
│ ├── src/
│ │ ├── config/ # Environment config, logger setup
│ │ ├── controllers/ # Thin HTTP layer
│ │ ├── database/ # Sequelize connection, migrations, seeders
│ │ ├── middleware/ # Auth, validation, error handling
│ │ ├── models/ # Sequelize models and associations
│ │ ├── repositories/ # Data access layer
│ │ ├── routes/ # Route definitions
│ │ ├── services/ # Business logic
│ │ ├── utils/ # Password hashing, JWT helpers
│ │ └── validators/ # express-validator schemas
│ └── tests/
│ ├── unit/ # Mocked, isolated service tests
│ └── integration/ # Real HTTP tests against a test database
├── frontend/
│ ├── src/
│ │ ├── api/ # Shared Axios instance
│ │ ├── components/ # Shared, reusable UI components
│ │ ├── context/ # AuthContext
│ │ ├── features/ # Feature specific hooks and components
│ │ ├── layouts/ # Page layout shells
│ │ ├── pages/ # Route level pages
│ │ ├── services/ # Frontend API service layer
│ │ └── validations/ # Zod schemas
│ └── tests/ # Jest and React Testing Library tests
├── docs/ # SonarQube reports
└── sonar-project.properties