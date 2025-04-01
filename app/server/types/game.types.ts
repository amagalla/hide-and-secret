export type BaseResponse = {
    status?: number;
    statusCode?: number;
    success?: boolean;
    error?: string;
    message?: string;
}

export type GetAllMessagesResponse = BaseResponse & {
    secretMessages?: Array<{
        secrets_id: number;
        message: string;
        id: string;
        latitude: number;
        longitude: number;
    }>;
}

export type SecretMessage = {
    secrets_id: number;
    message: string;
    id: string;
    latitude: number;
    longitude: number;
}