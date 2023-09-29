import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import CreateUserDTO from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface';
import { AppComponent } from '../../types/app-components.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import loginUserDto from './dto/login-user.dto.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
        @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public create = async (dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> => {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);
    const createdUser = await this.userModel.create({...user, isPro: false});

    this.logger.info(`New user with email: ${dto.email} has been created`);
    return createdUser;
  };

  public findByEmail = async (email: string): Promise<DocumentType<UserEntity> | null> => await this.userModel.findOne({email});

  public exists = async (id: string): Promise<boolean> => await this.userModel.findById(id) !== null;

  public findOrCreate = async (dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> => {
    const existedUser = await this.findByEmail(dto.email);

    return existedUser ?? await this.create(dto, salt);

  };

  public verifyUser = async (dto: loginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> => {
    const userRow = await this.findByEmail(dto.email);

    if (!userRow) {
      return null;
    }

    const user = new UserEntity(userRow);
    user.setPassword(userRow.password);
    const isRealUser = user.verifyPassword(dto.password, salt);

    if (isRealUser) {
      return userRow;
    }
    return null;

  };

}
