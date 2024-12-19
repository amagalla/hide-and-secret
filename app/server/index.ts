import express from 'express';
import path from 'path';
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
const { BASE_URL } = process.env;
const { PORT } = process.env || 3000;

const swaggerFilePath = path.resolve(__dirname, './config/swagger/swaggerOptions.yml');
const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf-8');
const options: swaggerDoc.Options = yml.load(swaggerFile) as Options;

const { definition }  = options;

if (definition?.servers && Array.isArray(definition.servers)) {
    definition.servers = definition.servers.map(server => {
        if (typeof server.url === 'string') {
            server.url = server.url.replace("{{BASE_URL}}", `${BASE_URL}${PORT}`);
        }
        return server;
    });
}

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

export default app;