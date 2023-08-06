import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface';
import HTTPError from '../errors/http-error.js';

export default class PrivateRouteMiddleware implements MiddlewareInterface {

  public execute = async ({ user }: Request, _res: Response, next: NextFunction): Promise<void> => {

    if (!user) {
      throw new HTTPError(
        StatusCodes.UNAUTHORIZED,
        'User unauthorized',
        'PrivateRoute'
      );
    }

    return next();

  };
}
