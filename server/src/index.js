import { bootstrap } from './bootstrap.js';
import { logger } from './lib/logger.js';

bootstrap().catch((err) => {
  logger.error('Fatal startup error', { message: err.message });
  process.exit(1);
});
