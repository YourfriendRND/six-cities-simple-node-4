import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { createSHA256 } from '../../core/helpers/index.js';
import { User } from '../../types/user.type';
import { UserSchemaLimits } from './user.constants.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'user'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {

    @prop({
      required: true,
      minlength: UserSchemaLimits.MIN_NAME_LENGTH,
      maxlength: UserSchemaLimits.MAX_NAME_LENGTH,
    })
  public name!:string;

    @prop({
      required: true,
      unique: true,
      match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    })
    public email!: string;

    @prop({default: ''})
    public avatarUrl?: string;

    @prop({
      required: true,
    })
    public isPro!: boolean;

    @prop({
      required: true,
    })
    private _password!: string;

    constructor(
      userData: User
    ) {
      super();
      this.name = userData.name;
      this.email = userData.email;
      this.isPro = userData.isPro;
      this.avatarUrl = userData.avatarUrl;
    }

    get password (): string {
      return this._password;
    }

    public setPassword = (password: string, salt?: string): void => {
      if (salt) {
        this._password = createSHA256(password, salt);
        return;
      }
      this._password = password;
    };

    public verifyPassword = (password: string, salt: string): boolean => {
      const passwordHash = createSHA256(password, salt);
      console.log('in db', this.password);
      console.log('outer world', passwordHash);
      return passwordHash === this.password;
    };

}

export const UserModel = getModelForClass(UserEntity);

