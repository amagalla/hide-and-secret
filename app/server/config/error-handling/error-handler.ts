import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import createError from 'http-errors';

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const errorHandler = (
  err: createError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status: number = err.status || 500;
  const message: string = err.message || 'Internal Server Error';

  logger.error(`Status: ${status}, Message: ${message}`);

  res.status(status).json({
    error: message,
  });
};

export default errorHandler;
