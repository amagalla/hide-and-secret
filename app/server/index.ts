import express, { Request, Response } from 'express';
import setupRoutes from './routes/setupRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import runMigrations from './db/run-migrations';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

runMigrations();

setupRoutes(app);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));