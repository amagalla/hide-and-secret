import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import createError from 'http-errors';

const isValidEmail = (req: Request, resp: Response, next: NextFunction) => {
  if (!validator.isEmail(req.body.email)) {
    return next(createError(400, 'Please use a valid email'));
  }

  return next();
};

export default isValidEmail;
