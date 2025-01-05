import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

const migrationsPath = path.resolve(__dirname, './db/knex/migrations');

dotenv.config({ path: `.env` });

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: migrationsPath,
      extension: '.ts',
    },
  },
  staging: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: migrationsPath,
      extension: '.js',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: migrationsPath,
      extension: '.js',
    },
  },
};

export default knexConfig;
