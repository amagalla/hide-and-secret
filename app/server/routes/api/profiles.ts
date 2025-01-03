import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { registerUser, loginUser } from '../../controller/profiles';
import { RegisterUserResponse, LoginUserResponse } from '../../types/profiles.types';
import hashPassword from '../../middleware/profiles/hash-password';
import emailValidator from '../../middleware/profiles/email-validator';
import usernameValidator from '../../middleware/profiles/username-validator';
 
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
*      LoginUser:
 *          type: object
 *          description: User login
 *          properties:
 *              email:
 *                  type: string
 *                  example: email@email.test
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
    emailValidator,
    usernameValidator,
    hashPassword,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let resp: RegisterUserResponse;

        const { email, username, password } = req.body;

        try {
            resp = await registerUser(email, username, password);
            
            if (resp && resp.error) {
                const status = resp.status || 500;
                return next(createError(status, `${resp.error}`));
            }
            
            res.status(200).send(resp)
        } catch (err: unknown) {
            if (err instanceof Error) {
                return next(createError(`${err.message}` || 'An error has occured'));
            }
        }
    }
);

/**
 * @swagger
 * 
 *  /api/profiles/login:
 * 
 *  post:
 *      description: Verifies user login credentials
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: Login
 *            description: User profile information
 *            required: true
 *            schema:
 *              $ref: '#/definitions/LoginUser'
 *      responses:
 *          200:
 *              description: Loging successful
 *          400:
 *              description: Login failed
 */

router.post(
    '/login',
    emailValidator,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let resp: LoginUserResponse | undefined;

        const { email, password } = req.body;

        if (!password) {
            return next(createError(400, 'Password required'));
        }

        try {
            resp = await loginUser(email, password);
            
            if (resp && resp.error) {
                const status = resp.status || 500;
                return next(createError(status, `${resp.error}`));
            }
    
            res.status(200).send(resp);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return next(createError(`${err.message}` || 'An error has occured'));
            }
        }

    }
);

export default router;