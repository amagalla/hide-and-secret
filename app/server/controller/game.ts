import db from '../db/mysql.config';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { SecretMessage } from '../types/game.types';

const getAllMessages = async () => {
    const getAllMessagesQuery = 'SELECT * FROM public_secrets';

    try {
        const [resp] = await db.query<RowDataPacket[]>(getAllMessagesQuery);

        const secretMessages: SecretMessage[] = resp.map((row) => ({
            secrets_id: row.secrets_id,
            message: row.message,
            id: row.id,
            latitude: row.latitude,
            longitude: row.longitude,
        }));

        return {
            success: true,
            statusCode: 200,
            message: 'Retrieved all secret messages successfully',
            secretMessages
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 500, error: 'Unexpected error occurred when retrieving all secret messages' };
        }
    }

    return { status: 500, error: 'Unexpected error occurred ' };
}

const postNewSecret = async (message: string, id: string, latitude: number, longitude: number) => {
    const postNewSecretQuery = `INSERT INTO public_secrets (message, id, latitude, longitude) VALUES (?, ?, ?, ?)`;

    try {
        const [result] = await db.query<ResultSetHeader>(postNewSecretQuery, [message, id, latitude, longitude]);

        if (result.affectedRows === 0) {
            return { status: 400, error: 'Failed to post new secret message' };
        }

        return {
            success: true,
            statusCode: 201,
            message: 'New secret message posted successfully',
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 500, error: 'Unexpected error occurred when posting new secret message' };
        }
    }

    return { status: 500, error: 'Unexpected error occurred when posting new secret message' };
}

export {
    getAllMessages,
    postNewSecret
}