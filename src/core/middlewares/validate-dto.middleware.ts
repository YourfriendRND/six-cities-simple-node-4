import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface';

export default class ValidateDtoMiddleware implements MiddlewareInterface {

  constructor(
    private dto: ClassConstructor<object>,
    private readonly innerBodyFieldName?: string,
  ) {}

  public execute = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const bodyPath = this.innerBodyFieldName
      ? JSON.parse(req.body[this.innerBodyFieldName])
      : req.body;

    const dtoInstance = plainToInstance(this.dto, bodyPath);
    const errors = await validate(dtoInstance);

    if (errors.length) {
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      return;
    }

    next();
  };


}

