import {
  MinLength,
  MaxLength,
  IsEmail
} from 'class-validator';
import { UserSchemaLimits } from '../user.constants.js';
import { userValidateErrorMessage } from './user-validate-error-message.js';

export default class LoginUserDTO {
  @IsEmail({}, {message: userValidateErrorMessage.email.message })
  public email!: string;

  @MinLength(UserSchemaLimits.MIN_PASSWORD_LENGTH, { message: userValidateErrorMessage.password.minLengthMessage })
  @MaxLength(UserSchemaLimits.MAX_PASSWORD_LENGTH, { message: userValidateErrorMessage.password.maxLengthMessage })
  public password!: string;

}
