import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

const hashPassword = async (req: Request, resp: Response, next: NextFunction): Promise<void> => {
  const { password } = req.body;

  if (!password) {
    return next(createError(400, "Password is required"));
  }

  if (password.length < 8 || password.length > 64) {
    return next(createError(400, 'Password needs to be between 8 to 64 characters long'));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    next();
  } catch (err) {
    return next(createError(500, 'Error hashing password'));
  }
};

export default hashPassword;
