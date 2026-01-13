# Authentication Service

A secure, production-ready authentication microservice built with TypeScript, following Clean Architecture principles. This service provides user registration, login, session management, and JWT-based authentication.

## Features

- 🔐 **Secure Authentication**: JWT-based token authentication with HTTP-only cookies
- 🛡️ **Password Security**: Argon2 password hashing with pepper
- ✨ **Clean Architecture**: Domain-driven design with clear separation of concerns
- 🔄 **Session Management**: Token-based session handling with logout support
- ✅ **Input Validation**: JSON Schema validation using AJV
- 🗄️ **PostgreSQL Database**: Type-safe database queries with Drizzle ORM
- 🧪 **Comprehensive Testing**: Unit and integration tests with Vitest
- 📝 **Logging**: Request logging with Pino
- 🐳 **Docker Support**: Containerized PostgreSQL database

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: Argon2
- **Validation**: AJV (JSON Schema)
- **Testing**: Vitest + Supertest
- **Logging**: Pino
- **Containerization**: Docker Compose

## Architecture

The project follows Clean Architecture principles with the following layers:

```
src/
├── entities/          # Domain entities (User, Session, AuthUser)
├── usecases/          # Business logic and use cases
│   ├── ports/         # Inbound and outbound port interfaces
│   ├── dtos/          # Data transfer objects
│   └── errors/        # Domain-specific errors
├── adapters/          # Controllers and presenters
├── infrastructure/    # External concerns (API, DB, Auth, Validation)
│   ├── api/           # Express routes and app setup
│   ├── auth/          # JWT and password crypto implementations
│   ├── persistence/   # Database schemas and repositories
│   ├── validation/    # Input validators
│   └── utils/         # Configuration and middleware
```

### Use Cases

- **Register**: Create a new user account
- **Login**: Authenticate user and issue JWT token
- **Logout**: Invalidate user session
- **Authenticate**: Verify JWT token validity
- **Profile**: Retrieve authenticated user information
- **Delete**: Remove user account

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (or use Docker Compose)

### Development Mode (with hot reload)

1. Install dependencies
```bash
npm install
```

2. Set up environment variables
Create a `.env` file in the root directory:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=auth_db
JWT_SECRET=your_jwt_secret_key
PEPPER=your_password_pepper
```
This `.env` configures the node server & docker-compose simultaneously to have matching configuration.

3. Start the PostgreSQL database
```bash
docker compose up -d auth_database
```

4. Run database migrations
```bash
npx drizzle-kit push
```

5. Start the development server
```bash
npm run dev
```

The service will be available at `http://localhost:3000`

### Run Locally

1. Install dependencies
```bash
npm install
```

2. Set up environment variables
Create a `.env` file in the root directory:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=auth_db
JWT_SECRET=your_jwt_secret_key
PEPPER=your_password_pepper
```
This `.env` configures the node server & docker-compose simultaneously to have matching configuration.

3. Start the PostgreSQL database & application
```bash
docker compose up
```

4. Run database migrations
```bash
npx drizzle-kit push
```
Already configured via `.env`.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint` - Apply ESLint suggested fixes
- `npm run db:studio` - Open Drizzle Studio for database management

### Running Tests

```bash
# Run all tests
npm test

# Run tests once
npm test -- --run

# Run specific test file
npm test -- authenticate.test.ts
```

### Database Management

View and manage your database using Drizzle Studio:
```bash
npm run db:studio
```

### Database Migration

Generate migrations:
```bash
npx drizzle-kit generate
```

Apply migrations:
```bash
npx drizzle-kit migrate
```

## Security Features

- **Password Hashing**: Argon2 with pepper for additional security
- **JWT Tokens**: Signed tokens with expiration
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS-only in production
- **SameSite Cookies**: CSRF protection
- **Input Validation**: JSON Schema validation for all inputs
- **Error Handling**: Sanitized error messages, no sensitive data exposure

## Error Responses

The API returns standardized error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

**Common Error Codes:**
- `400` - Validation error or bad request
- `401` - Unauthorized (invalid or missing token)
- `409` - Conflict (e.g., email already exists)
- `500` - Internal server error

## Project Structure

```
auth/
├── src/
│   ├── entities/              # Domain models
│   ├── usecases/              # Business logic
│   │   ├── ports/             # Interface definitions
│   │   ├── dtos/              # Data transfer objects
│   │   └── errors/            # Custom error classes
│   ├── adapters/              # Controllers and presenters
│   └── infrastructure/        # Technical implementations
│       ├── api/               # Express setup and routes
│       ├── auth/              # JWT and password handling
│       ├── persistence/       # Database layer
│       ├── validation/        # Input validators
│       └── utils/             # Config and middleware
├── tests/
│   ├── integration/           # API integration tests
│   ├── usecases/              # Unit tests for use cases
│   └── mocks/                 # Test doubles
├── drizzle/                   # Database migrations
├── docker-compose.yml         # PostgreSQL container
└── package.json
```

## License

ISC

