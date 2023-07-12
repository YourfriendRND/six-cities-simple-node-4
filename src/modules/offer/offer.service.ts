import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface';
import { AppComponent } from '../../types/app-components.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { OfferSchemaLimits } from './offer.constants.js';
import { SortType } from '../../types/sort-type.enum.js';
import { Offer } from '../../types/offer.type.js';
import ReceivedSpecificOfferDto from './dto/received-specific-offer.dto.js';

@injectable()
export default class OfferService implements OfferServiceInterface {

  constructor(
        @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public create = async (dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> => {
    const createdOffer = await this.offerModel.create(dto);
    this.logger.info('New offer has been created in the database');

    return createdOffer;
  };

  public updateOffer = async (
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<Offer | null> => {
    await this.offerModel.findByIdAndUpdate(offerId, dto).exec();
    const updatedOffer = await this.findByOfferId(offerId);
    this.logger.info(`Offer with id: ${offerId} has been updated`);
    return updatedOffer;
  };

  public deleteOffer = async (offerId: string): Promise<DocumentType<OfferEntity> | null> => {
    const deletedOffer = await this.offerModel.findByIdAndDelete(offerId);
    this.logger.info(`Offer Offer with id: ${offerId} has been deleted`);
    return deletedOffer;
  };

  public find = async (limit = OfferSchemaLimits.DEFAULT_OFFER_REQUEST_LIMIT): Promise<DocumentType<OfferEntity>[]> => {
    const offers = await this.offerModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: {offerId: '$_id'},
          pipeline: [
            {$match: {$expr: { $eq: ['$$offerId', '$offerId'] } } },
          ],
          as: 'comments'
        }
      },
      { $addFields:
        { id: { $toString: '$_id'},
          authorId: { $toString: '$authorId'},
          commentCount: { $size: '$comments'},
          rating: {
            $cond: {
              if: { $eq: [{$size: '$comments'}, 0] },
              then: 0,
              else: { $round: [{$divide: [ {$sum: '$comments.rating'},{ $size: '$comments'}]}, 1]}
            }
          }
        },
      },
      {$limit: limit},
      {$sort: {'createdAt': SortType.Down}},
      {$unset: ['comments']}
    ]);

    return offers;
  };


  public findByOfferId = async (
    offerId: string
  ): Promise<Offer | null> => {
    const offers = await this.offerModel.aggregate<DocumentType<ReceivedSpecificOfferDto>>([
      { $match: { $expr : { $eq: [ '$_id' , { $toObjectId: offerId } ] } } },
      {
        $lookup: {
          from: 'comments',
          let: {offerId: '$_id'},
          pipeline: [
            {$match: {$expr: { $eq: ['$$offerId', '$offerId'] } } },
          ],
          as: 'comments'
        }
      },
      {
        $lookup: {
          from: 'user',
          let: {userId: '$authorId'},
          pipeline: [
            {$match: {$expr: {$eq: ['$$userId', '$_id']}}}
          ],
          as: 'author',
        },
      },
      { $addFields:
        { id: { $toString: '$_id'},
          commentCount: { $size: '$comments'},
          rating: {
            $cond: {
              if: { $eq: [{$size: '$comments'}, 0] },
              then: 0,
              else: { $round: [{$divide: [ {$sum: '$comments.rating'},{ $size: '$comments'}]}, 1]}
            }
          }
        },
      },
      {$unset: [
        'comments',
        'author._id',
        'author._password',
        'author.createdAt',
        'author.email',
        'author.updatedAt',
        'author.__v',
      ]}
    ]).exec();

    const [targetOffer] = offers;
    return targetOffer ? {
      ...targetOffer,
      author: {...targetOffer.author[0]}
    } : null;
  };
}
