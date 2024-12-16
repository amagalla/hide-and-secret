import mysql, { Pool } from 'mysql2/promise';
import env from 'dotenv';
import { logger } from '../config/logger/winton';

env.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool: Pool = mysql.createPool({
  host: DB_HOST,
  port: parseInt(DB_PORT as string, 10),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

pool
  .getConnection()
  .then(() => {
    logger.info('Mysql connected...');
  })
  .catch((err) => {
    throw err;
  });

export default pool;
