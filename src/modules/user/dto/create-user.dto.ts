import {
  MinLength,
  MaxLength,
  IsEmail,
  IsBoolean,
  IsUrl,
  IsOptional
} from 'class-validator';
import { UserSchemaLimits } from '../user.constants.js';
import { userValidateErrorMessage } from './user-validate-error-message.js';

export default class CreateUserDTO {

  @MinLength(UserSchemaLimits.MIN_NAME_LENGTH, {message: userValidateErrorMessage.name.minLengthMessage })
  @MaxLength(UserSchemaLimits.MAX_NAME_LENGTH, {message: userValidateErrorMessage.name.maxLengthMessage })
  public name!: string;

  @IsEmail({}, {message: userValidateErrorMessage.email.message })
  public email!: string;

  @MinLength(UserSchemaLimits.MIN_PASSWORD_LENGTH, {message: userValidateErrorMessage.password.minLengthMessage })
  @MaxLength(UserSchemaLimits.MAX_PASSWORD_LENGTH, {message: userValidateErrorMessage.password.maxLengthMessage })
  public password!: string;

  @IsOptional()
  @IsUrl({}, {message: userValidateErrorMessage.avatar.message })
  public avatarUrl?: string;

  @IsBoolean({message: userValidateErrorMessage.isPro.message })
  public isPro!: boolean;

}
