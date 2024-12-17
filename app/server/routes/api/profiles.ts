import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { registerUser } from '../../services/registration';
import { RegisterUserResponse } from '../../types/profiles.types';
 
const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *      RegisterUser:
 *          type: object
 *          description: User's information
 *          properties:
 *              email:
 *                  type: string
 *                  example: email@email.test
 *              username:
 *                  type: string
 *                  example: amagalla
 *              password:
 *                  type: string
 *                  example: abcd1234
 */

/**
 * @swagger
 *
 *  /api/profiles/register:
 *
 *  post:
 *      description: Register a new User
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: User to register
 *            description: The user's information
 *            required: true
 *            schema:
 *              $ref: '#/definitions/RegisterUser'
 *      responses:
 *          200:
 *              description: User registered successfully
 *          400:
 *              description: Registration failed
 */

router.post(
    '/register',
    async (req: Request, res: Response, next: NextFunction) => {
        let resp: RegisterUserResponse | undefined;

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