import knex from 'knex';
import knexConfig from '../knexfile';

async function runMigrations() {
  const environment = process.env.NODE_ENV || 'development';
  const config = knexConfig[environment];
  const db = knex(config);

  try {
    await db.migrate.latest();
    console.info('Migrations are finished');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

export default runMigrations;
