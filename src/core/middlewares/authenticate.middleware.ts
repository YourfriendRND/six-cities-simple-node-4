import { createSecretKey } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface';
import HTTPError from '../errors/http-error.js';

export default class AuthenticateMiddleware implements MiddlewareInterface {

  constructor(
    private readonly jwtSecret: string
  ) {}

  public execute = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authorizationHeader = req.headers?.authorization?.split(' ');

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(token, createSecretKey(this.jwtSecret, 'utf-8'));

      req.user = {
        email: payload.email as string,
        id: payload.id as string
      };

      return next();
    } catch {
      return next(
        new HTTPError(
          StatusCodes.UNAUTHORIZED,
          'invalid user token',
          'AuthenticateMiddleware'
        )
      );
    }
  };


}
