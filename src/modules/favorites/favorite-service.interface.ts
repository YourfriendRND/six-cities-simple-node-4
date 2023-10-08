import { DocumentType } from '@typegoose/typegoose';
// import { Offer } from '../../types/offer.type';
//import { FavoriteEntityOfferWrapper } from '../../types/favorite.type';
// import { OfferEntity } from '../offer/offer.entity';
import { FavoriteEntity } from './favorite.entity.js';


export interface FavoriteServiceInterface {
  find: (userId: string) => Promise<DocumentType<FavoriteEntity>[]>,
  changeFavoriteStatus: (userId: string, offerId: string, status: number) => Promise<DocumentType<FavoriteEntity>[]>
}
