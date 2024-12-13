import { createLogger, format, transports } from 'winston';
import { Request, Response, NextFunction } from 'express';

const { combine, printf } = format;

const customFormat = printf(({ level, message }) => {
  return `[${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(customFormat),
  transports: [new transports.Console()],
});

declare global {
  namespace Express {
    interface Request {
      logger: typeof logger;
    }
  }
}

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.logger = logger;
  req.logger.info(`${req.method} ${req.url}`);
  next();
};

export { logger, loggerMiddleware };
