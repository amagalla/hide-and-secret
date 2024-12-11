import express, { Request, Response } from 'express';
import setupRoutes from './routes/setupRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

setupRoutes(app);

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));