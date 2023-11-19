import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from '../../types/middleware.interface';
import HTTPError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export default class ValidatePhotosMiddleware implements MiddlewareInterface {

  constructor(
    private readonly fieldName: string,
    private readonly countElements: number
  ) {}

  public execute = (req: Request, _res: Response, next: NextFunction): void => {
    const photos = req.files;
    console.log(photos);

    if (!photos?.length) {
      throw new HTTPError(
        StatusCodes.BAD_REQUEST,
        `The field ${this.fieldName} should not be empty`,
        `${ValidatePhotosMiddleware.name}`
      );
    }

    if (photos.length !== this.countElements) {
      throw new HTTPError(
        StatusCodes.BAD_REQUEST,
        `The field ${this.fieldName} should contain exactly ${this.countElements} elements`,
        `${ValidatePhotosMiddleware.name}`
      );
    }

    if (Array.isArray(photos)) {
      const isMimeTypeCorrect = photos.every((photo) => photo.mimetype === 'image/jpeg');
      if (!isMimeTypeCorrect) {
        throw new HTTPError(
          StatusCodes.BAD_REQUEST,
          `The elements of field ${this.fieldName} should be have a image/jpeg mimetype`,
          `${ValidatePhotosMiddleware.name}`
        );
      }
    } else {
      throw new HTTPError(
        StatusCodes.BAD_REQUEST,
        `The field ${this.fieldName} should be array`,
        `${ValidatePhotosMiddleware.name}`
      );
    }

    next();
  };
}
