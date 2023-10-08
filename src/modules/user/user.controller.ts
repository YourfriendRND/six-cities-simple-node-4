import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import * as core from 'express-serve-static-core';
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
import UpdateUserDTO from './dto/update-user.dto.js';
import ValidateDtoMiddleware from '../../core/middlewares/validate-dto.middleware.js';
import { createJWT } from '../../core/helpers/user.js';
import { JWT_ALGORITHM } from './user.constants.js';
import LoginUserRDO from './rdo/login-user.rdo.js';
import AuthenticateMiddleware from '../../core/middlewares/authenticate.middleware.js';

type RequestId = {
  id: string;
}

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

    this.addRoute({
      path: '/login',
      method: HttpMethods.Get,
      handler: this.checkLogin,
      middlewares: [
        new AuthenticateMiddleware(this.configService.get('JWT_SECRET'))
      ]
    });

    this.addRoute({
      path: '/avatar/:id',
      method: HttpMethods.Patch,
      handler: this.addUserAvatar,
      middlewares: [

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
    const token = await createJWT(JWT_ALGORITHM, this.configService.get('JWT_SECRET'), { email: createdUser.email, userId: createdUser.id });
    const unitedUser = {
      id: createdUser.id,
      token,
      avatarUrl: createdUser.avatarUrl,
      email: createdUser.email,
      isPro: createdUser.isPro,
      name: createdUser.name
    };

    this.created(res, fillDTO(UserRDO, unitedUser));
  };

  public loginUser = async (
    { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDTO>,
    res: Response,
    _next: NextFunction): Promise<void> => {

    const existUser = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!existUser) {
      throw new HTTPError(
        StatusCodes.UNAUTHORIZED,
        `User with email: ${body.email} not exist`,
        'UserController'
      );
    }

    const token = await createJWT(JWT_ALGORITHM, this.configService.get('JWT_SECRET'), { email: existUser.email, userId: existUser.id });

    this.ok(res, fillDTO(LoginUserRDO, {name: existUser.name, email: existUser.email, token}));
  };

  public checkLogin = async (
    { user }: Request<Record<string, unknown>, Record<string, unknown>>,
    res: Response,
    _next: NextFunction
  ) => {

    if (!user) {
      throw new HTTPError(
        StatusCodes.UNAUTHORIZED,
        'User is unauthorized',
        'UserController'
      );
    }

    const userDetails = await this.userService.findByEmail(user.email);
    if (!userDetails) {
      throw new HTTPError(
        StatusCodes.NOT_FOUND,
        `User with email: ${user.email} not exist`,
        'UserController'
      );
    }

    this.ok(res, fillDTO(UserRDO, userDetails));
  };

  public addUserAvatar = async (
    { params, body }: Request<core.ParamsDictionary | RequestId, Record<string, unknown>, UpdateUserDTO>,
    _res: Response,
    _next: NextFunction
  ) => {
    this.logger.info(params.id);
    this.logger.info(body.avatarUrl);
  };

}

