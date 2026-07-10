import { bootstrap } from './bootstrap.js';
import { createDetectionHook } from './detection/evaluator.js';
import { logger } from './lib/logger.js';

bootstrap({ buildOnLog: createDetectionHook }).catch((err) => {
  logger.error('Fatal startup error', { message: err.message });
  process.exit(1);
});
