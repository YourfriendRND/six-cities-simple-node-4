import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import ConfigService from '../../core/config/config.service.js';
import Controller from '../../core/controller/controller.abstract.js';
import { fillDTO } from '../../core/helpers/common.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { AppComponent } from '../../types/app-components.enum.js';
import { HttpMethods } from '../../types/http-methods.enum.js';
import CreateUserDTO from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface';
import UserRDO from './rdo/user.rdo.js';
import HTTPError from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import LoginUserDTO from './dto/login-user.dto.js';
import ValidateDtoMiddleware from '../../core/middlewares/validate-dto.middleware.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) private configService: ConfigService
  ) {
    super(logger);

    this.logger.info('Register routers for user controller...');

    this.addRoute({
      path: '/register',
      method: HttpMethods.Post,
      handler: this.createUser,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDTO)
      ]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethods.Post,
      handler: this.loginUser,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDTO)
      ]
    });
  }

  public createUser = async (
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDTO>,
    res: Response,
  ): Promise<void> => {
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HTTPError(
        StatusCodes.CONFLICT,
        `User with email: ${body.email} already exist`,
        'UserController'
      );
    }

    const createdUser = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRDO, createdUser));
  };

  public loginUser = async (
    { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDTO>,
    _res: Response, _next: NextFunction): Promise<void> => {
    const existUser = await this.userService.findByEmail(body.email);

    if (!existUser) {
      throw new HTTPError(
        StatusCodes.UNAUTHORIZED,
        `User with email: ${body.email} not exist`,
        'UserController'
      );
    }

    throw new HTTPError(
      StatusCodes.NOT_IMPLEMENTED,
      'This case will be implemented in the future',
      'UserController'
    );

  };

}

