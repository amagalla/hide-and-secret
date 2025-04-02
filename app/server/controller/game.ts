import db from '../db/mysql.config';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { SecretMessage, SecretStash, Ranking } from '../types/game.types';

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

const getStashedSecrets = async (profile_id: string) => {
    const getStashedSecretsQuery = 'SELECT stash_id, message, player_id, player_username FROM secret_stash WHERE profile_id = ?';

    try {
        const [resp] = await db.query<RowDataPacket[]>(getStashedSecretsQuery, [profile_id]);

        const stashedSecrets: SecretStash[] = resp.map((row) => ({
            stash_id: row.stash_id,
            message: row.message,
            player_id: row.player_id,
            player_username: row.player_username,
        }));

        return {
            success: true,
            statusCode: 200,
            message: 'Retrieved all stashed secret messages successfully',
            stashedSecrets
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 500, error: 'Unexpected error occurred when retrieving stashed secret messages' };
        }
    }
}

const getAllRanking = async () => {
    const getAllRankingQuery = `
        SELECT 
        profile_id, 
        username, 
        score 
        FROM profiles 
        ORDER BY score DESC;
    `;

    try {
        const [resp] = await db.query<RowDataPacket[]>(getAllRankingQuery);

        const ranking: Ranking[] = resp.map((row) => ({
            profile_id: row.profile_id,
            username: row.username,
            score: row.score,
        }));

        return {
            success: true,
            statusCode: 200,
            message: 'Retrieved ranking successfully',
            ranking
        }

    } catch (err: unknown) {
        if (err instanceof Error) {
            return { status: 500, error: 'Unexpected error occurred when retrieving ranking' };
        }
    }
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
        selectMessageQuery = `
            SELECT 
            ps.message, 
            ps.profile_id AS player_id, 
            p.username
            FROM public_secrets ps
            JOIN profiles p ON ps.profile_id = p.profile_id
            WHERE ps.secret_id = ?;
            `,
        deleteQuery = 'DELETE FROM public_secrets WHERE secret_id = ?',
        stashQuery = 'INSERT INTO secret_stash (message, profile_id, player_id, player_username) VALUES (?, ?, ?, ?)',
        scoreUpdateQuery = 'UPDATE profiles SET score = score + 1 WHERE profile_id = ?';
    
    try {
        const [rows] = await db.query<RowDataPacket[]>(selectMessageQuery, [secret_id]);

        if (rows.length === 0) {
            return { status: 400, error: 'Secret message not found or already deleted' };
        }

        const { message, player_id, username } = rows[0];

        if (player_id === profile_id) {
            return { status: 400, error: 'You cannot stash your own secret message' };
        }

        await db.query(deleteQuery, [secret_id]);

        await db.query(stashQuery, [message, profile_id, player_id, username]);

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
    getStashedSecrets,
    getAllRanking,
    postNewSecret,
    deleteAndStashSecret
}