import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { MiddlewareInterface } from '../../types/middleware.interface';
import HTTPError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export default class ValidateObjectIdMiddleware implements MiddlewareInterface {

  constructor(
    private readonly param: string,
  ) {}

  execute = (
    { params }: Request<ParamsDictionary>,
    _res: Response,
    next: NextFunction
  ): void => {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HTTPError(
      StatusCodes.BAD_REQUEST,
      `entity id: ${objectId} in request params is invalid ObjectID, please, check it and try request again`,
      'validateObjectIdMiddleware'
    );

  };

}
