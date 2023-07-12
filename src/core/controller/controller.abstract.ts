import { injectable } from 'inversify';
import { Router, Response } from 'express';
import { ControllerInterface } from './controller.interface';
import { LoggerInterface } from '../logger/logger.interface';
import { RouteInterface } from '../../types/route.interface';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

@injectable()
export default abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface
  ) {
    this._router = Router();
  }

  get router () {
    return this._router;
  }

  public addRoute = (route: RouteInterface): void => {
    const routeHandler = expressAsyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map((middleware) => expressAsyncHandler(middleware.execute.bind(this)));
    const handlerList = middlewares ? [...middlewares, routeHandler] : routeHandler;

    this._router[route.method](route.path, handlerList);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  };

  public send = <T>(res: Response, statusCode: number, data: T): void => {
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  };

  public created = <T>(res: Response, data: T): void => {
    this.send(res, StatusCodes.CREATED, data);
  };

  public ok = <T>(res: Response, data: T): void => {
    this.send(res, StatusCodes.OK, data);
  };

  public noContent = <T>(res: Response, data?: T): void => {
    this.send(res, StatusCodes.NO_CONTENT, data);
  };
}

