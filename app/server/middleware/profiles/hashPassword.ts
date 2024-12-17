import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

const hashPassword = async (req: Request, resp: Response, next: NextFunction) => {
  const { password } = req.body;

  try {
    await bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        next(createError('Error hashing password'));
      }

      req.body.password = hash;

      next();
    });
  } catch (err) {
    next(createError('Bcrypt failed'));
  }
};

export default hashPassword;
