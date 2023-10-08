import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { AppComponent } from '../../types/app-components.enum.js';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';
import FavoriteController from './favorite.controller.js';
import { ControllerInterface } from '../../core/controller/controller.interface.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import FavoriteService from './favorite.service.js';

export const createFavoriteContainer = (): Container => {
  const favoriteContainer = new Container();

  favoriteContainer.bind<types.ModelType<FavoriteEntity>>(AppComponent.FavoriteModel).toConstantValue(FavoriteModel);
  favoriteContainer.bind<ControllerInterface>(AppComponent.FavoriteController).to(FavoriteController).inSingletonScope();
  favoriteContainer.bind<FavoriteServiceInterface>(AppComponent.FavoriteService).to(FavoriteService).inSingletonScope();

  return favoriteContainer;
};
