import { UserSchemaLimits } from '../user.constants.js';

export const userValidateErrorMessage = {
  name: {
    minLengthMessage: `Minimum length of user name should be ${UserSchemaLimits.MIN_NAME_LENGTH}`,
    maxLengthMessage: `Maximum lenght of user name should be ${UserSchemaLimits.MAX_NAME_LENGTH}`
  },

  email: {
    message: 'Email field is invalid string'
  },

  password: {
    minLengthMessage: `Minimum length of password should be ${UserSchemaLimits.MIN_PASSWORD_LENGTH}`,
    maxLengthMessage: `Maximum length of paaword should be ${UserSchemaLimits.MAX_PASSWORD_LENGTH}`,
  },

  avatar: {
    message: 'Avatar url is invalid string, it should be match url type of string'
  },

  isPro: {
    message: 'isPro field should be boolean type'
  }
};
