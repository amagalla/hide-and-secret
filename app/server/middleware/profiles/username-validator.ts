import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

const checkRegReq = (req: Request, resp: Response, next: NextFunction) => {
  const { username } = req.body;

  if (!username) {
    next(createError(400, "Username is required"));
  }

  if ((username && username.length < 4) || username.length > 20) {
    return next(createError(400, 'Username needs to be between 4 - 20 characters long'));
  }

  return next();
};

export default checkRegReq;
