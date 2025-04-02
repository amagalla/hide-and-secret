import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import authenticateToken from '../../middleware/profiles/authenticate';
import { authUserInfo } from '../../@types/req';
import { getAllMessages, postNewSecret, deleteAndStashSecret, getStashedSecrets, getAllRanking } from '../../controller/game';
import { GetAllMessagesResponse, BaseResponse } from '../../types/game.types';

const router = express.Router();

/**
 * @swagger
 * 
 * definitions:
 *   PostNewSecret:
 *     type: object
 *     description: New secret message to be added
 *     properties:
 *          message:
 *              type: string
 *              example: This is a secret message
 *          latitude:
 *              type: number
 *              example: 37.7749
 *          longitude:
 *              type: number
 *              example: -122.4194
 */

/**
 * @swagger
 * 
 * /api/game/getAllMessages:
 *   get:
 *      description: Get all secret messages
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successfully retrieved all secret messages
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                              statusCode:
 *                                  type: integer
 *                              message:
 *                                  type: string
 *                              secretMessages:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          secrets_id:
 *                                              type: number
 *                                          message:
 *                                              type: string
 *                                          profile_id:
 *                                              type: number
 *                                          latitude:
 *                                              type: number
 *                                          longitude:
 *                                              type: number
 *          401:
 *              description: Unauthorized User
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 401
 *                              error:
 *                                  type: string
 *                                  example: Unauthorized User
 *          500:
 *              description: Internal Server Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: integer
 *                                  example: 500
 *                              error:
 *                                  type: string
 *                                  example: Unexpected error occurred when retrieving all secret messages
 */

router.get(
    '/getAllMessages',
    authenticateToken,
    async (req: authUserInfo, res: Response, next: NextFunction): Promise<void> => {

        if (!req.user) {
            return next(createError(401, 'Unauthorized user'));
        }

        let resp: GetAllMessagesResponse;

        try {
            resp = await getAllMessages();

            if (resp && resp.error) {
                const status = resp.status || 500;
                return next(createError(status, `${resp.error}`));
            }

            res.status(200).send(resp);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return next(createError(`${err.message}` || 'An error has occurred'));
            }
        }

    }
);

/**
 * @swagger
 * 
 * /api/game/stash:
 *  get:
 *     description: Get all stashed secret messages
 *     produces:
 *        - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all stashed secret messages
 *       401:
 *         description: Unauthorized User
 *       500:
 *         description: Internal Server Error
 */

router.get(
    '/stash',
    authenticateToken,
    async (req: authUserInfo, res: Response, next: NextFunction): Promise<void> => {
        if (!req.user) {
            return next(createError(401, 'Unauthorized User'));
        }

        let resp;

        try {
            resp = await getStashedSecrets(req.user.profile_id);

            if (resp && resp.error) {
                const status = resp.status || 500;
                return next(createError(status, `${resp.error}`));
            }

            res.status(200).send(resp);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return next(createError(500, `${err.message}` || 'An error has occurred'));
            }
        }
    }
)

/**
 * @swagger
 * 
 * /api/game/ranking:
 *  get:
 *      description: Get the ranking of all players
 *      produces:
 *          - application/json
 *      security:
 *         - bearerAuth: []
 *      responses:
 *          200:
 *             description: Successfully retrieved ranking
 *          401:
 *             description: Unauthorized User
 *          500:
 *             description: Internal Server Error
 */

router.get(
    '/ranking',
    authenticateToken,
    async (req: authUserInfo, res: Response, next: NextFunction): Promise<void> => {

        let resp;

        try {
            resp = await getAllRanking();

            if (resp && resp.error) {
                const status = resp.status || 500;
                return next(createError(status, `${resp.error}`));
            }

            res.status(200).send(resp);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return next(createError(500, `${err.message}` || 'An error has occurred'));
            }
        }
    }
)

/**
 * @swagger
 * 
 * /api/game/postNewSecret:
 *   post:
 *      description: Post a new secret message
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: body
 *            name: body
 *            description: Message object that needs to be added to the database
 *            required: true
 *            schema:
 *              $ref: '#/definitions/PostNewSecret'
 *      responses:
 *          201:
 *              description: Successfully posted new secret message
 *          400:
 *              description: Bad Request - Message is required
 *          401:
 *              description: Unauthorized User
 *          500:
 *              description: Internal Server Error
 */

router.post(
    '/postNewSecret',
    authenticateToken,
    async (req: authUserInfo, res: Response, next: NextFunction): Promise<void> => {

        if (!req.user) {
            return next(createError(401, 'Unauthorized User'));
        }

        const { message, latitude, longitude } = req.body;

        if (message.length <= 0 || typeof message !== 'string') {
            return next(createError(400, 'Message is required'));
        }

        if (message.length > 500) {
            return next(createError(400, 'Message is too long. Must be less than 500 characters'));
        }
        if (!latitude || typeof latitude !== 'number' || !longitude || typeof longitude !== 'number') {
            return next(createError(400, 'Latitude and Longitude must be valid numbers'));
        }


        let resp: BaseResponse;

        const { profile_id } = req.user;

        try {
            resp = await postNewSecret(message, profile_id, latitude, longitude);

            if (resp && resp.error) {
                const status = resp.status || 500;
                return next(createError(status, `${resp.error}`));
            }

            res.status(201).send(resp);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return next(createError(500, `${err.message}` || 'An error has occurred'));
            }
        }
    }
);

/**
 * @swagger
 * 
 * /api/game/secrets/{secretId}/stash:
 *   post:
 *      description: Delete a secret message and stash it
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *         - in: path
 *           name: secretId
 *           required: true
 *           description: The ID of the secret message to be deleted and stashed
 *           type: string
 *      responses:
 *          200:
 *              description: Successfully deleted and stashed the secret message
 *          400:
 *              description: Bad Request - Invalid stash ID or Secret message not found
 *          401:
 *              description: Unauthorized User
 *          500:
 *              description: Internal Server Error
 */

router.post(
    '/secrets/:secretId/stash',
    authenticateToken,
    async (req: authUserInfo, res: Response, next: NextFunction): Promise<void> => {

        if (!req.user) {
            return next(createError(401, 'Unauthorized User'));
        }

        const
            { secretId } = req.params,
            { profile_id } = req.user;

        let resp: BaseResponse;

        try {
            resp = await deleteAndStashSecret(profile_id, secretId);

            if (resp && resp.error) {
                const status = resp.status || 500;
                return next(createError(status, `${resp.error}`));
            }

            res.status(200).send(resp);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return next(createError(500, `${err.message}` || 'An error has occurred'));
            }
        }
    }
);

export default router;