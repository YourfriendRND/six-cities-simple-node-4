import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import Controller from '../../core/controller/controller.abstract.js';
import OfferService from './offer.service.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { AppComponent } from '../../types/app-components.enum.js';
import { HttpMethods } from '../../types/http-methods.enum.js';
import { fillDTO } from '../../core/helpers/index.js';
import OffersRDO from './rdo/offers.rdo.js';
import OfferRDO from './rdo/offer.rdo.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDTO from './dto/update-offer.dto.js';
import { EntityQuery } from '../../types/query-params.type.js';
import ValidateObjectIdMiddleware from '../../core/middlewares/validate-objectid.middleware.js';
import ValidateDtoMiddleware from '../../core/middlewares/validate-dto.middleware.js';
import DocumentExistMiddleware from '../../core/middlewares/document-exists.middleware.js';
import PrivateRouteMiddleware from '../../core/middlewares/private-route.middleware.js';
import OwnerEntityMiddleware from '../../core/middlewares/owner-entity.middleware.js';

type RequestOfferParams = {
  id: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Regiser routers for offer controller...');

    this.addRoute({
      path: '/',
      method: HttpMethods.Get,
      handler: this.index
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethods.Get,
      handler: this.exactOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.offerService, 'Offers', 'id')
      ]
    });

    this.addRoute({
      path: '/',
      method: HttpMethods.Post,
      handler: this.createOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethods.Patch,
      handler: this.updateOffer,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateOfferDTO),
        new DocumentExistMiddleware(this.offerService, 'Offers', 'id'),
        new OwnerEntityMiddleware(this.offerService, 'Offers', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethods.Delete,
      handler: this.deleteOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.offerService, 'Offers', 'id'),
        new OwnerEntityMiddleware(this.offerService, 'Offers', 'id')
      ]
    });
  }

  public index = async (
    { query }: Request<core.ParamsDictionary, unknown, unknown, EntityQuery>,
    res: Response
  ): Promise<void> => {
    const offers = await this.offerService.find(query.limit);
    const offersResponse = fillDTO(OffersRDO, offers);
    this.ok(res, offersResponse);
  };

  public exactOffer = async (
    { params }: Request<core.ParamsDictionary | RequestOfferParams>,
    res: Response
  ): Promise<void> => {
    const offer = await this.offerService.findByOfferId(params.id);
    const offerResponse = fillDTO(OfferRDO, offer);
    this.ok(res, offerResponse);
  };

  public createOffer = async (
    { body, user }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> => {
    const createdOffer = await this.offerService.create({...body, authorId: user.id, rating: 1, commentCount: 0});
    this.created(res, fillDTO(OffersRDO, createdOffer));
  };

  public updateOffer = async (
    { params, body }: Request<core.ParamsDictionary | RequestOfferParams, Record<string, unknown>, UpdateOfferDTO>,
    res: Response): Promise<void> => {

    const offer = await this.offerService.findByOfferId(params.id);

    if (offer) {
      const updatedOffer = await this.offerService.updateOffer(params.id, {...body, rating: offer.rating, commentCount: offer.commentCount});
      this.created(res, fillDTO(OfferRDO, updatedOffer));
      return;
    }

    this.noContent(res);

  };

  public deleteOffer = async (
    { params }: Request<core.ParamsDictionary | RequestOfferParams>,
    res: Response
  ): Promise<void> => {
    await this.offerService.deleteOffer(params.id);
    this.noContent(res);
  };

}
