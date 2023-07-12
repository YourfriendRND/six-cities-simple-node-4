import { Expose, Exclude, Type } from 'class-transformer';
import UserRDO from '../../user/rdo/user.rdo.js';
import OffersRDO from './offers.rdo.js';

export default class OfferRDO extends OffersRDO {
  @Expose()
  @Type(() => UserRDO)
  public author!: UserRDO;

  @Exclude()
  public authorId!: string;

}
