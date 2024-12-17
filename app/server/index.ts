import express, { Request, Response } from 'express';
import fs from 'fs';
import yml from 'js-yaml';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import setupRoutes from './routes/setupRoutes';
import runMigrations from './db/run-migrations';
import { logger, loggerMiddleware } from './config/logger/winton';
import errorHandler from './config/error-handling/error-handler';
import swaggerDoc, { Options } from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import authenticate from './middleware/swagger/authenticate';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerFile = fs.readFileSync('./config/swagger/swaggerOptions.yml', 'utf-8');
const options: swaggerDoc.Options = yml.load(swaggerFile) as Options;
const docs = swaggerDoc(options);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/admin/swagger', authenticate, swaggerUI.serve, swaggerUI.setup(docs));

runMigrations();

app.use(loggerMiddleware);

setupRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => logger.info(`Running on port ${PORT}`));