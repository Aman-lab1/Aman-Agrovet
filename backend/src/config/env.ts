import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env if present, then backend/.env if present
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.SQL_USER || 'postgres'}:${process.env.SQL_PASSWORD || 'postgres'}@${process.env.SQL_HOST || '127.0.0.1'}:${process.env.SQL_PORT || '5432'}/${process.env.SQL_DB_NAME || 'aman_agrovet_v3'}`;

export const env = {
  PORT: Number(process.env.PORT || 4000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  DATABASE_URL: databaseUrl,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-in-env',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  INITIAL_OWNER_USERNAME: (process.env.INITIAL_OWNER_USERNAME || 'aman').trim().toLowerCase(),
  INITIAL_OWNER_NAME: (process.env.INITIAL_OWNER_NAME || 'Aman Rajpura').trim(),
  INITIAL_OWNER_PASSCODE: process.env.INITIAL_OWNER_PASSCODE || '',
} as const;
