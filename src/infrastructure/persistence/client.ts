import { drizzle } from 'drizzle-orm/node-postgres';
import config from '../utils/config';

const db = drizzle(config.database.url);

export default db;