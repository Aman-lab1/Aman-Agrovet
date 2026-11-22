import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`AMAN Agrovet V3 API listening on http://localhost:${env.PORT}`);
});
