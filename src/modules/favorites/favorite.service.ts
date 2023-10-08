import { injectable, inject } from 'inversify';
import { DocumentType } from '@typegoose/typegoose';
import { AppComponent } from '../../types/app-components.enum.js';
import { FavoriteServiceInterface } from './favorite-service.interface';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { FavoriteEntity } from './favorite.entity.js';
import { types } from '@typegoose/typegoose';
import { SortType } from '../../types/sort-type.enum.js';

@injectable()
export default class FavoriteService implements FavoriteServiceInterface {

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>,
  ) {
    this.logger.info('Favorite servise has been initialized...');
  }

  public find = async (userId: string): Promise<DocumentType<FavoriteEntity>[]> => await this.favoriteModel.aggregate([
    {
      $match: { $expr : { $eq: [ '$userId' , { $toObjectId: userId } ] } }
    },
    {
      $lookup: {
        from: 'offer',
        let: {offerId: '$offerId'},
        pipeline: [
          {
            $match: {
              $and: [
                {$expr: { $eq: ['$$offerId', '$_id'] }},
                {$expr: { $eq: [true, '$isActive'] }}
              ]
            }
          },
        ],
        as: 'offer'
      }
    },
    {$unwind: '$offer'},
    {
      $lookup: {
        from: 'comments',
        let: {offerId: '$offerId'},
        pipeline: [
          {$match: {$expr: { $eq: ['$$offerId', '$offerId'] } } },
        ],
        as: 'comments'
      }
    },
    { $addFields:
      { 'offer.id': { $toString: '$offer._id'},
        'offer.authorId': { $toString: '$offer.authorId'},
        'offer.commentCount': { $size: '$comments'},
        'offer.rating': {
          $cond: {
            if: { $eq: [{$size: '$comments'}, 0] },
            then: 0,
            else: { $round: [{$divide: [ {$sum: '$comments.rating'},{ $size: '$comments'}]}, 1]}
          }
        },
        'offer.isFavorite': true
      },
    },
    {$sort: {'createdAt': SortType.Down}},
    {$replaceRoot: { newRoot: '$offer' }},
  ]);

  public changeFavoriteStatus = async (userId: string, offerId: string, status: number): Promise<DocumentType<FavoriteEntity>[]> => {
    const existFavorite = await this.favoriteModel.findOne({userId: userId, offerId: offerId });
    console.log(existFavorite);

    if (status) {
      if (!existFavorite) {
        await this.favoriteModel.create({
          userId,
          offerId
        });
      }
    } else {
      if (existFavorite) {
        await this.favoriteModel.deleteOne({ _id: existFavorite._id });
      }
    }

    return await this.find(userId);
  };

}
