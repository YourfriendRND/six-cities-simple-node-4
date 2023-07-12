import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import Controller from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { AppComponent } from '../../types/app-components.enum.js';
import { HttpMethods } from '../../types/http-methods.enum.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import HTTPError from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import CreateCommentDto from './dto/create-comment.dto.js';
import CommentRdo from './rdo/comment.rdo.js';
import { fillDTO } from '../../core/helpers/common.js';
import { EntityQuery } from '../../types/query-params.type';
import { CommentSchemaLimits } from './comment.contants.js';
import ValidateDtoMiddleware from '../../core/middlewares/validate-dto.middleware.js';
import ValidateObjectIdMiddleware from '../../core/middlewares/validate-objectid.middleware.js';

type CommentParams = {
  offerId: string;
}

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register comment routes...');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethods.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethods.Post,
      handler: this.createComment,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
  }

  public index = async (
    { params, query }: Request<core.ParamsDictionary | CommentParams, unknown, unknown, EntityQuery>,
    res: Response
  ): Promise<void> => {
    const offer = await this.offerService.findByOfferId(params.offerId);

    if (!offer) {
      throw new HTTPError(
        StatusCodes.NOT_FOUND,
        `Offer with id: ${params.offerId} doesn't exist`,
        'CommentController'
      );
    }
    // Ограничение выгрузки комментариев до 50
    const limit = Number(query.limit) > CommentSchemaLimits.REQUEST_COMMENTS_LIMIT
      ? CommentSchemaLimits.REQUEST_COMMENTS_LIMIT
      : Number(query.limit);

    const commentsByOffer = await this.commentService.findCommentsByOfferId(params.offerId, limit);
    this.ok(res, fillDTO(CommentRdo, commentsByOffer));
  };

  public createComment = async (
    { params, body }: Request<core.ParamsDictionary | CommentParams, Record<string, unknown>, CreateCommentDto>,
    res: Response
  ): Promise<void> => {
    const offer = await this.offerService.findByOfferId(params.offerId);

    if (!offer) {
      throw new HTTPError(
        StatusCodes.NOT_FOUND,
        `Imposible to create new comment, offer with id: ${params.offerId} doesn't exist`,
        'CommentController'
      );
    }

    const createdComment = await this.commentService.createComment({...body, offerId: params.offerId });

    this.created(res, fillDTO(CommentRdo, createdComment));

  };

}
