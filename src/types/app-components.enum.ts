export const AppComponent = {
  RestApplication: Symbol.for('RestApplication'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DataBaseClientInterface: Symbol.for('DataBaseClientInterface'),
  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
  OfferModel: Symbol.for('OfferModel'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  CommentModel: Symbol.for('CommentModel'),
  OfferController: Symbol.for('OfferController'),
  UserController: Symbol.for('UserController'),
  CommentController: Symbol.for('CommentController'),
  ExceptionFilters: Symbol.for('ExceptionFilters')
} as const;
