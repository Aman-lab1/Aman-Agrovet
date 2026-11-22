import { createApp } from './app.js';
import { env } from './config/env.js';
import { seedInitialOwnerIfEmpty } from './db/seed.js';
import { logger } from './utils/logger.js';

async function startServer(): Promise<void> {
  try {
    await seedInitialOwnerIfEmpty();
  } catch (err) {
    logger.info(
      'Database not reachable during startup seed check (expected if PostgreSQL is not yet running).',
      { error: err instanceof Error ? err.message : String(err) },
    );
  }

  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`AMAN Agrovet V3 API listening on http://localhost:${env.PORT}`);
  });
}

void startServer();
