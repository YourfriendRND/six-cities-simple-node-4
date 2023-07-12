import express, { Express } from 'express';
import { ConfigInterface } from '../core/config/config.interface';
import { LoggerInterface } from '../core/logger/logger.interface';
import { DataBaseClientInterface } from '../core/database-client/database-client.interface';
import { RestSchema } from '../core/config/rest.schema';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../types/app-components.enum.js';
import { getDataBaseUri } from '../core/helpers/index.js';
import { ExceptionFiltersInterface } from '../core/exception-filters/exception-filters.interface';
import { ControllerInterface } from '../core/controller/controller.interface';

@injectable()
export default class RestApplication {
  private expressApp: Express;
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DataBaseClientInterface) private readonly databaseClient: DataBaseClientInterface,
    @inject(AppComponent.OfferController) private readonly offerController: ControllerInterface,
    @inject(AppComponent.UserController) private readonly userController: ControllerInterface,
    @inject(AppComponent.CommentController) private readonly commentController: ControllerInterface,
    @inject(AppComponent.ExceptionFilters) private readonly exceptionFilters: ExceptionFiltersInterface
  ) {
    this.expressApp = express();
  }

  private _initDataBase = async () => {
    this.logger.info('Init database');
    const mongoUriConnection = getDataBaseUri(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return await this.databaseClient.connect(mongoUriConnection);
  };

  private _initServer = async (): Promise<void> => {
    this.logger.info('Server initialization...');
    const port = this.config.get('PORT');
    this.expressApp.listen(port, () => this.logger.info(`Server has been start on PORT: ${port}`));
  };

  private _initRoutes = async (): Promise<void> => {
    this.logger.info('Routes initialization...');
    this.expressApp.use('/offers', this.offerController.router);
    this.expressApp.use('/user', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  };

  private _initMiddleWare = async (): Promise<void> => {
    this.logger.info('Global middleware initialization...');
    this.expressApp.use(express.json());
    this.expressApp.use(express.urlencoded({ extended: true }));
  };

  private _initExceptionFilters = async (): Promise<void> => {
    this.logger.info('Init exception filters');
    this.expressApp.use(this.exceptionFilters.catch.bind(this.exceptionFilters));
  };

  public init = async (): Promise<void> => {
    this.logger.info('Application initialization...');
    this.logger.info(`Got value from .env file, application port: ${this.config.get('PORT')}`);
    this.logger.info('start init databse');
    await this._initDataBase();
    this.logger.info('Connection to database completed');
    await this._initMiddleWare();
    await this._initRoutes();
    await this._initExceptionFilters();
    await this._initServer();
  };

}
