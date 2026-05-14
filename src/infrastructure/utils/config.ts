import 'dotenv/config';

function getEnv(name: string): string {
  if (!process.env[name]) {
    throw new Error(`Missing env: ${name}`);
  }
  return process.env[name];
} 

function buildDatabaseUrl(): string {
  const host = getEnv('DB_HOST');
  const port = getEnv('DB_PORT');
  const username = getEnv('DB_USERNAME');
  const password = getEnv('DB_PASSWORD');
  const databaseName = getEnv('DB_NAME');
  return `postgresql://${username}:${password}@${host}:${port}/${databaseName}`;
}

function buildRabbitMqUrl(): string {
  const host = getEnv('RABBITMQ_HOST');
  const port = getEnv('RABBITMQ_PORT');
  const user = getEnv('RABBITMQ_USER');
  const password = getEnv('RABBITMQ_PASSWORD');
  return `amqp://${user}:${password}@${host}:${port}`;
}

export default {
  port: Number(getEnv('PORT')),
  grpcPort: Number(getEnv('GRPC_PORT')),
  pepper: getEnv('PEPPER'),
  jwtSecret: getEnv('JWT_SECRET'),
  runtime: {
    isDocker: process.env.DOCKER_ENV === 'true',
  },
  corsOrigins: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : [] as string[],
  database: {
    url: buildDatabaseUrl(),
  },
  rabbitmq: {
    url: buildRabbitMqUrl(),
  },
};