import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import config from './src/infrastructure/utils/config';

export default defineConfig({
  out: './drizzle',
  schema: './src/infrastructure/persistence/**/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.database.url || '',
  },
});