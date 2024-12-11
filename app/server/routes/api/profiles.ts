import express, { Request, Response } from 'express';

const router = express.Router();

router.get(
    '/server',
    async (req: Request, res: Response) => {
        res.status(200).send({ success: 'Hello from Express' });
    }
);

export default router;