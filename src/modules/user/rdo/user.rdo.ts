import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export default class UserRDO {
  @Expose()
  public id!: ObjectId;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl!: string;

  @Expose()
  public isPro!: boolean;

  @Expose()
  public token?: string;

}
