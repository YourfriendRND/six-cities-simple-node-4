import { Expose } from 'class-transformer';

export default class LoginUserRDO {
  @Expose()
  public email!: string;

  @Expose()
  public token!: string;
}
