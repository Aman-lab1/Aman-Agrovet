import { count } from 'drizzle-orm';
import { pathToFileURL } from 'node:url';
import { env } from '../config/env.js';
import { hashPasscode } from '../utils/passcode.js';
import { logger } from '../utils/logger.js';
import { db, pool } from './index.js';
import { users } from './schema/index.js';

/**
 * Idempotently seeds the initial Business Owner account when the users table is empty.
 * Requires INITIAL_OWNER_PASSCODE to be configured in environment variables.
 */
export async function seedInitialOwnerIfEmpty(): Promise<void> {
  const [{ total }] = await db.select({ total: count() }).from(users);
  if (Number(total) > 0) {
    return;
  }

  if (!env.INITIAL_OWNER_PASSCODE) {
    logger.info('Users table is empty, but INITIAL_OWNER_PASSCODE is not set; skipping owner bootstrap.');
    return;
  }

  const passcodeHash = hashPasscode(env.INITIAL_OWNER_PASSCODE);
  await db
    .insert(users)
    .values({
      username: env.INITIAL_OWNER_USERNAME,
      fullName: env.INITIAL_OWNER_NAME,
      passcodeHash,
      role: 'owner',
      isActive: true,
    })
    .onConflictDoNothing({ target: users.username });

  logger.info(`Bootstrapped initial Business Owner account "${env.INITIAL_OWNER_USERNAME}".`);
}

const isDirectExecution =
  typeof process.argv[1] === 'string' &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  seedInitialOwnerIfEmpty()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      logger.error('Database seed failed', err);
      await pool.end();
      process.exit(1);
    });
}
