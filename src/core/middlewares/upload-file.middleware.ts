import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from '../../types/middleware.interface';

// TODO: 32 коммит реализовать middleware
export default class UploadFileMiddleware implements MiddlewareInterface {
  execute = (_req: Request, _res: Response, next: NextFunction): void => {
    next();
  };
}
