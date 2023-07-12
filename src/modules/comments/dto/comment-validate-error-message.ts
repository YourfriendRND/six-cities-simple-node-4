import { CommentSchemaLimits } from '../comment.contants.js';

export const commentValidateErrorMessage = {
  text: {
    minLengthMessage: `Minimum length of comment text should be ${CommentSchemaLimits.MIN_COMMENT_TEXT_LENGTH}`,
    maxLengthMessage: `Maximum length of comment text should be ${CommentSchemaLimits.MAX_COMMENT_TEXT_LENGTH}`
  },

  rating: {
    decimalMessage: 'Offer rating should be integer or decimal number with one sign after decimal',
    minRatingMessage: `Minimum rating offer number should be ${CommentSchemaLimits.MIN_COMMENT_RATING}`,
    maxRatingMessage: `Maximum rating offer number should be ${CommentSchemaLimits.MAX_COMMENT_RATING}`
  },

  authorId: {
    message: 'authorId field contain invalid value',
  },

  offerId: {
    message: 'offerId field contain invalid value'
  }

};
