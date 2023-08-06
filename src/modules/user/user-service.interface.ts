import { DocumentType } from '@typegoose/typegoose';
import CreateUserDTO from './dto/create-user.dto';
import { UserEntity } from './user.entity.js';
import { DocumentExistsInterface } from '../../types/document-exist.interface';
import LoginUserDTO from './dto/login-user.dto.js';

export interface UserServiceInterface extends DocumentExistsInterface {
    create: (dto: CreateUserDTO, salt: string) => Promise<DocumentType<UserEntity>>;
    findByEmail: (email: string) => Promise<DocumentType<UserEntity> | null>;
    findOrCreate: (dto: CreateUserDTO, salt: string) => Promise<DocumentType<UserEntity>>
    verifyUser: (dto: LoginUserDTO, salt: string) => Promise<DocumentType<UserEntity> | null>
}
