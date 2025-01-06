import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { registerUser, loginUser, registerUsername } from '../../controller/profiles';
import { RegisterUserResponse, LogUserResponse } from '../../types/profiles.types';
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
  *      RegisterUsername:
 *          type: object
 *          description: Username to be registered
 *          properties:
 *              username:
 *                  type: string
 *                  example: yuri
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
    hashPassword,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let resp: RegisterUserResponse;

        const { email, password } = req.body;

        try {
            resp = await registerUser(email, password);
            
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
        let resp: LogUserResponse;

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

/**
 * @swagger
 *
 *  /api/profiles/{id}/username:
 *
 *  patch:
 *      description: Register a username
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: username
 *            description: Username to be registered
 *            required: true
 *            schema:
 *              $ref: '#/definitions/RegisterUsername'
*          - in: path
 *            name: id
 *            desctiption: User's id to change username
 *            required: true
 *            type: number
 *      responses:
 *          200:
 *            description: Username updated successfully
 *          400:
 *            description: Username update failed
 *
 */

router.patch(
    '/:id/username',
    usernameValidator,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let resp: RegisterUserResponse;

        const { id } = req.params;
        const { username } = req.body;
        
        try {
            resp = await registerUsername(id, username);
            
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
)

export default router;