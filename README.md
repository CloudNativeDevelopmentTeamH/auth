# Authentication Service

An authentication microservice built with TypeScript, following Clean Architecture principles. Built as part of Cloud Native Development lecture. This service provides user registration, login, session management, and JWT-based authentication.

## Features

- 🔐 **Secure Authentication**: JWT-based token authentication with HTTP-only cookies
- 🛡️ **Password Security**: Argon2 password hashing with pepper
- ✨ **Clean Architecture**: Domain-driven design with clear separation of concerns
- 🔄 **Session Management**: Token-based session handling with logout support
- ✅ **Input Validation**: JSON Schema validation using AJV
- 🗄️ **PostgreSQL Database**: Type-safe database queries with Drizzle ORM
- 🧪 **Comprehensive Testing**: Unit and integration tests with Vitest
- 📝 **Logging**: Request logging with Pino
- 🐳 **Docker Support**: Containerized application and PostgreSQL database
- 🌐 **Dual Protocol Support**: Both HTTP REST and gRPC interfaces
- 📨 **Event Publishing**: RabbitMQ integration for async messaging after user registration

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **HTTP Framework**: Express.js
- **gRPC**: Protocol Buffers with @grpc/grpc-js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: Argon2
- **Validation**: AJV (JSON Schema)
- **Testing**: Vitest + Supertest
- **Logging**: Pino
- **Containerization**: Docker + Docker Compose
- **Message Broker**: RabbitMQ (amqplib)
- **Orchestration**: Kubernetes with Helm charts
- **Secrets Management**: SOPS for encryption
- **Cloud Platform**: AWS (EKS, ECR, ALB, EBS)

## Architecture

The project follows Clean Architecture principles with the following layers:

```
src/
├── server.ts              # Entry point - starts HTTP & gRPC servers
├── entities/              # Domain entities (User, Session, AuthUser)
├── usecases/              # Business logic and use cases
│   ├── ports/             # Inbound and outbound port interfaces
│   ├── dtos/              # Data transfer objects
│   ├── events/            # Domain event constants (routing keys, exchange names)
│   └── errors/            # Domain-specific errors
├── adapters/              # Protocol adapters
│   ├── http/              # HTTP controllers and presenters
│   └── grpc/              # gRPC service implementations
└── infrastructure/        # External concerns
    ├── api/               # Express routes and app setup
    ├── grpc/              # gRPC server and proto definitions
    ├── auth/              # JWT and password crypto implementations
    ├── persistence/       # Database schemas and repositories
    ├── messaging/         # RabbitMQ event publisher and local setup script
    ├── validation/        # Input validators
    └── utils/             # Configuration and middleware
```

Additional project structure:

```
├── tests/
│   ├── integration/           # API integration tests
│   ├── usecases/              # Unit tests for use cases
│   └── mocks/                 # Test doubles
├── helm/                      # Kubernetes Helm charts
├── drizzle/                   # Database migrations
├── docker-compose.yml         # PostgreSQL, RabbiqMQ & app containers
├── Dockerfile                 # Application container image
└── package.json
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

### Development Mode (with hot reload)

1. Install dependencies
```bash
npm install
```

2. Set up environment variables
Create a `.env` file in the root directory:
```env
PORT=4000
GRPC_PORT=50051

JWT_SECRET=your_jwt_secret_key
PEPPER=your_password_pepper

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=auth_db

RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_UI_PORT=15672
RABBITMQ_USER=test
RABBITMQ_PASSWORD=test
```
This `.env` configures both the Node.js server and Docker Compose to have matching configuration.

3. Start the PostgreSQL database
```bash
docker compose up -d database queue
```

4. Run database migrations
```bash
npx drizzle-kit push
```

5. Set up RabbitMQ topology
```bash
npm run setup:rabbitmq
```

6. Start the development server
```bash
npm run dev
```

The service will be available at:
- HTTP REST API: `http://localhost:4000`
- gRPC API: `localhost:50051`
- RabbitMQ: `localhost:15672`

### Run Locally

1. Install dependencies
```bash
npm install
```

2. Set up environment variables
Create a `.env` file in the root directory:
```env
PORT=4000
GRPC_PORT=50051

JWT_SECRET=your_jwt_secret_key
PEPPER=your_password_pepper

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=auth_db

RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_UI_PORT=15672
RABBITMQ_USER=test
RABBITMQ_PASSWORD=test
```
This `.env` configures both the Node.js server and Docker Compose to have matching configuration.

3. Start the PostgreSQL database, RabbitMQ & application
```bash
docker compose up
```
The entrypoint of the application will automatically run table creation/migration for PostgreSQL & setup the topology for RabbitMQ.

## Development

### Available Scripts

**Setup**
- `npm run setup:rabbitmq` - Declare RabbitMQ exchange, queue and binding for local development

**Development**
- `npm run dev` - Start development server with hot reload

**Build & Run**
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

**Testing**
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:watch` - Run tests in watch mode

**Code Quality**
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Apply ESLint suggested fixes

**Database**
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

## API Endpoints

### HTTP REST API & gRPC API

See [Insomnia.yaml](Insomnia.yaml)

**Proto Definition:** [auth.proto](src/infrastructure/grpc/proto/auth.proto)

## Kubernetes Deployment

The project includes Helm charts for deploying to Kubernetes clusters with full production-ready configurations.

### Helm Chart Structure

The Helm chart provides a complete Kubernetes deployment including:

- **Application Deployment**: 2-replica deployment with configurable resources
- **PostgreSQL StatefulSet**: Persistent database with EBS volume storage
- **Services**: ClusterIP services for both app and database
- **Ingress**: AWS ALB ingress controller integration
- **ConfigMaps**: Environment configuration management
- **Secrets**: Sensitive data management (encrypted)
- **ServiceAccount**: IAM role integration for AWS ECR access
- **PersistentVolumeClaim**: 1Gi EBS storage for PostgreSQL data

### Prerequisites

- Kubernetes cluster (tested on AWS EKS)
- Helm 3.x installed
- kubectl configured to access your cluster
- AWS ALB Ingress Controller installed (for ingress)
- Container image pushed to ECR or container registry

### Configuration

The [values.yaml](helm/values.yaml) file contains all configurable parameters:

```yaml
# Application settings
auth:
  name: auth-app
  port: 80
  grpcPort: 50051
  image:
    repository: <your-ecr-repo>/auth
    tag: latest
  replicas: 2

# PostgreSQL settings
postgres:
  serviceName: database
  port: 5432
  database: "auth"
  user: "test"
```

### Secrets Management

The project includes an encrypted secrets file [secrets.enc.yaml](helm/templates/secrets.enc.yaml) managed with [SOPS](https://github.com/mozilla/sops).

**Decrypt secrets before deployment:**

```bash
# Decrypt the encrypted secrets file
sops -d helm/templates/secrets.enc.yaml > helm/templates/secrets.yaml
```

The decrypted `secrets.yaml` should contain:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secrets
  namespace: auth
type: Opaque
stringData:
  DB_PASSWORD: "your_database_password"
  JWT_SECRET: "your_jwt_secret_key"
  PEPPER: "your_password_pepper"
```

### Deploy to Kubernetes

```bash
helm install auth ./helm -n auth --create-namespace
```

**(!not necessary!) Initial Database Setup:**

After the first deployment, you need to run database migrations. Port-forward to the PostgreSQL service and run Drizzle push:

```bash
kubectl port-forward svc/database 5432:5432 -n auth
npx drizzle-kit push
```

### Update Deployment

To update the deployment with new configurations or image versions:

```bash
# Update values.yaml or use --set flags
helm upgrade auth ./helm -n auth
```

### Uninstall

To remove the deployment:

```bash
helm uninstall auth -n auth
kubectl delete namespace auth
```

### Accessing the Application

After deployment, get the ingress URL:

```bash
kubectl get ingress -n auth
```

The ALB DNS name will be shown in the ADDRESS column. Access your API at:
```
http://<alb-dns-name>/api/auth/health
```

## License

ISC
