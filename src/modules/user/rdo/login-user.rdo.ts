import { Expose } from 'class-transformer';

export default class LoginUserRDO {
  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public token!: string;
}
