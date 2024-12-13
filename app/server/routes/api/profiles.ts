import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get(
    '/server',
    async (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send({ success: 'Hello from Express' });
    }
);

export default router;