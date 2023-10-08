import { injectable, inject } from 'inversify';
import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';
import Controller from '../../core/controller/controller.abstract.js';
import { AppComponent } from '../../types/app-components.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { HttpMethods } from '../../types/http-methods.enum.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import PrivateRouteMiddleware from '../../core/middlewares/private-route.middleware.js';
import { fillDTO } from '../../core/helpers/common.js';
import OffersRDO from '../offer/rdo/offers.rdo.js';

type RequestFavoriteOfferParams = {
  id: string;
  status: string;
}

@injectable()
export default class FavoriteController extends Controller {

  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.FavoriteService) private readonly favoriteService: FavoriteServiceInterface
  ) {
    super(logger);

    this.logger.info('Regiser routers for favorites controller...');

    this.addRoute({
      path: '/',
      method: HttpMethods.Get,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });

    this.addRoute({
      path: '/:id/:status',
      method: HttpMethods.Post,
      handler: this.changeFavoriteStatus,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
  }

  public index = async (
    { user }: Request<Record<string, unknown>, Record<string, unknown>>,
    res: Response,
  ): Promise<void> => {
    const favoriteOffers = await this.favoriteService.find(user.id);

    this.ok(res, fillDTO(OffersRDO, favoriteOffers));
  };

  public changeFavoriteStatus = async (
    { params, user }: Request<core.ParamsDictionary | RequestFavoriteOfferParams>,
    res: Response
  ): Promise<void> => {
    const updatedFavoriteOffers = await this.favoriteService.changeFavoriteStatus(user.id, params.id, Number(params.status));

    this.ok(res, fillDTO(OffersRDO, updatedFavoriteOffers));
  };

}
