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

export default {
  port: Number(getEnv('PORT')),
  grpcPort: Number(getEnv('GRPC_PORT')),
  pepper: getEnv('PEPPER'),
  jwtSecret: getEnv('JWT_SECRET'),
  corsOrigins: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : [],
  database: {
    host: getEnv('DB_HOST'),
    port: Number(getEnv('DB_PORT')),
    url: buildDatabaseUrl(),
    username: getEnv('DB_USERNAME'),
    password: getEnv('DB_PASSWORD'),
    databaseName: getEnv('DB_NAME')
  }
};