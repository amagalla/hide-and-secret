import { Request, Response, NextFunction } from 'express';
import basicAuth from 'basic-auth';

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const credentials = basicAuth(req);

  if (
    !credentials ||
    credentials.name !== process.env.ADMIN_USERNAME ||
    credentials.pass !== process.env.ADMIN_PASSWORD
  ) {
    res.set('WWW-Authenticate', 'Basic realm="admin"');
    res.status(401).send('Authentication required');
    return;
  }

  next();
};

export default authenticate;
