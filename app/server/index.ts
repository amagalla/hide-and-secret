import express, { Request, Response } from 'express';
import setupRoutes from './routes/setupRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

setupRoutes(app);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));