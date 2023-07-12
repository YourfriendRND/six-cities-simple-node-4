import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { AppComponent } from '../../types/app-components.enum.js';
import CommentService from './comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import CommentController from './comment.controller.js';
import { ControllerInterface } from '../../core/controller/controller.interface.js';


export const createCommentContainer = (): Container => {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(AppComponent.CommentServiceInterface).to(CommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(AppComponent.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<ControllerInterface>(AppComponent.CommentController).to(CommentController).inSingletonScope();

  return commentContainer;

};
