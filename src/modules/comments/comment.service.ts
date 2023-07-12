import { types, DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CommentServiceInterface } from './comment-service.interface';
import { AppComponent } from '../../types/app-components.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { CommentEntity } from './comment.entity';
import CreateCommentDto from './dto/create-comment.dto.js';
import { CommentSchemaLimits } from './comment.contants.js';
import { SortType } from '../../types/sort-type.enum.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public createComment = async (dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> => {
    const createdComment = (await this.commentModel.create(dto))
      .populate('authorId');

    this.logger.info('new comment has been created');

    return createdComment;
  };

  public findCommentsByOfferId = async (offerId: string, limit = CommentSchemaLimits.REQUEST_COMMENTS_LIMIT): Promise<DocumentType<CommentEntity>[]> => {
    const offerComments = await this.commentModel.find({offerId})
      .limit(limit)
      .sort({createdAt: SortType.Down})
      .populate('authorId')
      .exec();

    return offerComments;
  };
}

