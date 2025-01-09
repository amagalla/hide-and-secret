import { Request } from 'express';

export interface authUserInfo extends Request {
    user?: {
        id: string;
        email: string;
        username: string;
    };
}
