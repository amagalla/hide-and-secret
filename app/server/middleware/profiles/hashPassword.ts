import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

const hashPassword = async (req: Request, resp: Response, next: NextFunction): Promise<void> => {
  const { password } = req.body;

  if (!password) {
    next(createError(400, "Password is required"));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    next();
  } catch (err) {
    next(createError(500, 'Error hashing password'));
  }
};

export default hashPassword;
