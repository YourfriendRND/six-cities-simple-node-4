import { Expose } from 'class-transformer';
import { OfferCoordinates } from '../../../types/offer-coordinates.js';

export default class OffersRDO {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publishDate!: string;

  @Expose()
  public city!: string;

  @Expose()
  public prevImageUrl!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingType!: string;

  @Expose()
  public roomCount!: number;

  @Expose()
  public guestCount!: number;

  @Expose()
  public price!: number;

  @Expose()
  public facilities!: string[];

  @Expose()
  public authorId!: string;

  @Expose()
  public commentCount!: number;

  @Expose()
  public coordinates!: OfferCoordinates;

}
