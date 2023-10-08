import { DocumentType } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { Offer } from '../../types/offer.type.js';
import { DocumentExistsInterface } from '../../types/document-exist.interface';
import { DocumentOwnerInterface } from '../../types/document-owner.interface';

export interface OfferServiceInterface extends DocumentExistsInterface, DocumentOwnerInterface {
  create: (dto: CreateOfferDto) => Promise<DocumentType<OfferEntity>>,
  updateOffer: (offerId: string, UpdateOfferDto: UpdateOfferDto) => Promise<Offer | null>,
  deleteOffer: (offerId: string) => Promise<DocumentType<OfferEntity> | null>,
  find: (city: string, limit?: number, ownerId?: string) => Promise<DocumentType<OfferEntity>[]>,
  findByOfferId: (offerId: string, userId?: string) => Promise<Offer| null>,
}
