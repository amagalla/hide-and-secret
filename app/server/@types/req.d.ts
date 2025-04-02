import { Request } from 'express';

export interface authUserInfo extends Request {
    user?: {
        profile_id: string;
        email: string;
        username: string;
    };
}
