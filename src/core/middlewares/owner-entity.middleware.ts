import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface';
import { DocumentOwnerInterface } from '../../types/document-owner.interface';
import HTTPError from '../errors/http-error.js';

export default class OwnerEntityMiddleware implements MiddlewareInterface {

  constructor(
    private readonly service: DocumentOwnerInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public execute = async ({ params, body, user }: Request, _res: Response, next: NextFunction): Promise<void> => {
    const documentId = params[this.paramName] ? params[this.paramName] : body[this.paramName];
    const isOwner = await this.service.isOwner(documentId, user.id);

    if (!isOwner) {
      throw new HTTPError(
        StatusCodes.FORBIDDEN,
        `User with id: ${user.id} is not owner for ${this.entityName} with id: ${documentId}`,
        'OwnerEntityMiddleware'
      );
    }

    return next();

  };

}

