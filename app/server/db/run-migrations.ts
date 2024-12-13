import knex from 'knex';
import knexConfig from '../knexfile';
import { logger } from '../config/logger/winton';

async function runMigrations() {
  const environment = process.env.NODE_ENV || 'development';
  const config = knexConfig[environment];
  const db = knex(config);

  try {
    await db.migrate.latest();
    logger.info('Migrations are finished');
  } catch (error) {
    logger.error('Error running migrations:', error);
  }
}

export default runMigrations;
