import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { authUserInfo } from '../../@types/req';

const JWT_SECRET = process.env.JWT_SECRET;

type UserPlayload = {
    profile_id: string,
    email: string;
    username: string;
}

const authenticateToken = (req: authUserInfo, res: Response, next: NextFunction): void => {
    if (!JWT_SECRET) {
        return next(createError(400, "JWT_SECRET environment variable is not defined."));
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return next(createError(401, "Access denied. No token provided."));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded as UserPlayload;

        next();
    } catch (err) {
        return next(createError(400, "Invalid token."));
    }
};

export default authenticateToken;