import { Expose, Type } from 'class-transformer';
import UserRDO from '../../user/rdo/user.rdo.js';

export default class CommentRdo {

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose({ name: 'authorId' })
  @Type(() => UserRDO)
  public author!: UserRDO;

  @Expose()
  public createdAt!: Date;

}
