import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DocumentExistsInterface } from '../../types/document-exist.interface';
import { MiddlewareInterface } from '../../types/middleware.interface';
import HTTPError from '../errors/http-error.js';

export default class DocumentExist implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public execute = async ({ params, body }: Request, _res: Response, next: NextFunction): Promise<void> => {
    const documentId = params[this.paramName] ? params[this.paramName] : body[this.paramName];
    const document = await this.service.exists(documentId);

    if (!document) {
      throw new HTTPError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found`,
        'DocumentExistMiddleware'
      );
    }

    return next();
  };
}
