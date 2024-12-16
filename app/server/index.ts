import express, { Request, Response } from 'express';
import setupRoutes from './routes/setupRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import runMigrations from './db/run-migrations';
import { logger, loggerMiddleware } from './config/logger/winton';
import errorHandler from './config/error-handling/error-handler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

runMigrations();

app.use(loggerMiddleware);

setupRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => logger.info(`Running on port ${PORT}`));