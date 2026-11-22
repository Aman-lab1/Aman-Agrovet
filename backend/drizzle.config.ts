import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      `postgresql://${process.env.SQL_USER || 'postgres'}:${process.env.SQL_PASSWORD || 'postgres'}@${process.env.SQL_HOST || '127.0.0.1'}:${process.env.SQL_PORT || '5432'}/${process.env.SQL_DB_NAME || 'aman_agrovet_v3'}`,
  },
});
