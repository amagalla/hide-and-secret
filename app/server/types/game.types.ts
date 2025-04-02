export type BaseResponse = {
    status?: number;
    statusCode?: number;
    success?: boolean;
    error?: string;
    message?: string;
}

export type GetAllMessagesResponse = BaseResponse & {
    secretMessages?: Array<{
        secret_id: number;
        message: string;
        profile_id: string;
        latitude: number;
        longitude: number;
    }>;
}

export type SecretMessage = {
    secret_id: number;
    message: string;
    profile_id: string;
    latitude: number;
    longitude: number;
}