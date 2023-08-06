import { Expose } from 'class-transformer';

export default class UserRDO {
  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl!: string;

  @Expose()
  public isPro!: boolean;

}
