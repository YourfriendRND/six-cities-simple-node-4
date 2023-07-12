import { DocumentType } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { Offer } from '../../types/offer.type.js';

export interface OfferServiceInterface {
    create: (dto: CreateOfferDto) => Promise<DocumentType<OfferEntity>>,
    updateOffer: (offerId: string, UpdateOfferDto: UpdateOfferDto) => Promise<Offer | null>,
    deleteOffer: (offerId: string) => Promise<DocumentType<OfferEntity> | null>,
    find: (limit?: number) => Promise<DocumentType<OfferEntity>[]>,
    findByOfferId: (offerId: string) => Promise<Offer| null>,
}
