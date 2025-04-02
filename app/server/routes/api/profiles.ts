import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { registerUser, loginUser, registerUsername, getProfileInfo } from '../../controller/profiles';
import { RegisterUserResponse, LogUserResponse, GetUserInfoResponse } from '../../types/profiles.types';
import hashPassword from '../../middleware/profiles/hash-password';
import emailValidator from '../../middleware/profiles/email-validator';
import usernameValidator from '../../middleware/profiles/username-validator';
import authenticateToken from '../../middleware/profiles/authenticate';
import { authUserInfo } from '../../@types/req';
 
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
 *  /api/profiles/{profile_id}/username:
 *
 *  patch:
 *      description: Register a username
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: profile_id
 *            description: User's id to change username
 *            required: true
 *            type: number
 *          - in: body
 *            name: username
 *            description: Username to be registered
 *            required: true
 *            schema:
 *              $ref: '#/definitions/RegisterUsername'
 *      responses:
 *          200:
 *            description: Username updated successfully
 *          400:
 *            description: Username update failed
 *
 */

router.patch(
    '/:profile_id/username',
    usernameValidator,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let resp: RegisterUserResponse;

        const { profile_id } = req.params;
        const { username } = req.body;

        if (!profile_id) {
            return next(createError(400, 'Please register first'));
        }
        
        try {
            resp = await registerUsername(profile_id, username);
            
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

/**
 * @swagger
 * 
 * /api/profiles/me:
 *   get:
 *     description: Get full user's profile information
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile_id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 fullName:
 *                   type: string
 *       400:
 *         description: Failed to retrieve profile data due to a bad request
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */

router.get(
    '/me',
    authenticateToken,
    async (req: authUserInfo, res: Response, next: NextFunction): Promise<void> => {

        if (!req.user) {
            return next(createError(401, 'Unauthorized user'));
        }

        let resp: GetUserInfoResponse;

        try {
            resp = await getProfileInfo(req.user.profile_id);

            if (resp && resp.error) {
                const status = resp.status || 500;
                return next(createError(status, `${resp.error}`));
            }

            res.status(200).send(resp);

        } catch(err: unknown) {
            if (err instanceof Error) {
                return next(createError(`${err.message}` || 'An error has occured'));
            }
        }
    }
)

export default router;