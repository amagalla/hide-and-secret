import db from '../db/mysql.config';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { SecretMessage } from '../types/game.types';

const getAllMessages = async () => {
    const getAllMessagesQuery = 'SELECT * FROM public_secrets';

    try {
        const [resp] = await db.query<RowDataPacket[]>(getAllMessagesQuery);

        const secretMessages: SecretMessage[] = resp.map((row) => ({
            secret_id: row.secret_id,
            message: row.message,
            profile_id: row.profile_id,
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

const postNewSecret = async (message: string, profile_id: string, latitude: number, longitude: number) => {
    const postNewSecretQuery = `INSERT INTO public_secrets (message, profile_id, latitude, longitude) VALUES (?, ?, ?, ?)`;

    try {
        const [result] = await db.query<ResultSetHeader>(postNewSecretQuery, [message, profile_id, latitude, longitude]);

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

const deleteAndStashSecret = async (profile_id: string, secret_id: string) => {
    const
        selectMessageQuery = 'SELECT message FROM public_secrets WHERE secret_id = ?',
        deleteQuery = 'DELETE FROM public_secrets WHERE secret_id = ?',
        stashQuery = 'INSERT INTO secret_stash (message, profile_id) VALUES (?, ?)',
        scoreUpdateQuery = 'UPDATE profiles SET score = score + 1 WHERE profile_id = ?';

    try {
        const [rows] = await db.query<RowDataPacket[]>(selectMessageQuery, [secret_id]);

        if (rows.length === 0) {
            return { status: 400, error: 'Secret message not found or already deleted' };
        }

        const { message } = rows[0];

        await db.query(deleteQuery, [secret_id]);

        await db.query(stashQuery, [message, profile_id]);

        await db.query(scoreUpdateQuery, [profile_id]);

        return {
            success: true,
            statusCode: 200,
            message: 'Successfully deleted and stashed the secret message',
        }
    } catch (err) {
        if (err instanceof Error) {
            return { status: 500, error: 'Unexpected error occurred when deleting and stashing secret' };
        }
    }

    return { status: 500, error: 'Unexpected error occurred when deleting and stashing secret' };
}

export {
    getAllMessages,
    postNewSecret,
    deleteAndStashSecret
}