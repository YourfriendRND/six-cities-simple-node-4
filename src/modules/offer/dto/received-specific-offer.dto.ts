import { User } from '../../../types/user.type';
import { OfferCoordinates } from '../../../types/offer-coordinates.js';

// Тип конкретного получаемого предложения из БД
export default class ReceivedSpecificOfferDto {
  public id!: string;
  public name!: string;
  public description!: string;
  public publishDate!: string;
  public city!: string;
  public prevImageUrl!: string;
  public photos!: string[];
  public isPremium!: boolean;
  public rating!: number;
  public housingType!: string;
  public roomCount!: number;
  public guestCount!: number;
  public price!: number;
  public facilities!: string[];
  public author!: User[];
  public commentCount!: number;
  public coordinates!: OfferCoordinates;
}
