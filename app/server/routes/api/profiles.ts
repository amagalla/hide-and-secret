import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { registerUser } from '../../services/registration';
 
const router = express.Router();

router.post(
    '/register',
    async (req: Request, res: Response, next: NextFunction) => {
        let
            resp,
            error: Error | undefined;

        try {
            resp = await registerUser(req.body);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return next(createError(`${err.message}` || 'An error has occured'));
            }
        }

        if (resp && resp.error) {
            const status = resp.status || 500;
            return next(createError(status, `${resp.error}`));
        }
        
        res.status(200).send(resp)
    }
)

export default router;