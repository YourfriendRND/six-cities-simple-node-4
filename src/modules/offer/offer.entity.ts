import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import {Coordinates, OfferCoordinates} from '../../types/offer-coordinates.js';
import { OfferSchemaLimits, CITIES, HOUSING_TYPES, FACILITIES } from './offer.constants.js';
import { validateCityName, validatePhotosCount, validateRating, validateHousingType, validateFacilities } from './offer-schema-validators.js';
import { UserEntity } from '../user/user.entity.js';
import { Type } from 'class-transformer';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offer'
  }
})


export class OfferEntity extends defaultClasses.TimeStamps {

    @prop({ required: true, minlength: OfferSchemaLimits.MIN_NAME_LENGTH, maxlength: OfferSchemaLimits.MAX_NAME_LENGTH })
  public name!: string;

    @prop({ required: true, minlength: OfferSchemaLimits.MIN_DESC_LENGTH, maxlength: OfferSchemaLimits.MAX_DESC_LENGTH })
    public description!: string;

    @prop({ required: true })
    public publishDate!: string;

    @prop({ required: true, validate: [ validateCityName, `The city name should be one of these cities: ${CITIES.join(', ')}` ] })
    public city!: string;

    @prop({ required: true })
    public prevImageUrl!: string;

    @prop({ type: () => [String], required: true, validate: [ validatePhotosCount, `Number of photos must be ${OfferSchemaLimits.REQUIRED_PHOTOS_COUNT}` ]})
    public photos!: string[];

    @prop({ required: true })
    public isPremium!: boolean;

    @prop({ required: true, validate: [ validateRating, 'The rating offer should be from 1 to 5 and contain only one number after decimal' ] })
    public rating!: number;

    @prop({ required: true, validate: [ validateHousingType, `Housing type should be one of these option: ${HOUSING_TYPES}` ] })
    public housingType!: string;

    @prop({ required: true, min: OfferSchemaLimits.MIN_ROOM_COUNT, max: OfferSchemaLimits.MAX_ROOM_COUNT })
    public roomCount!: number;

    @prop({ required: true, min: OfferSchemaLimits.MIN_GUEST_COUNT, max: OfferSchemaLimits.MAX_GUEST_COUNT })
    public guestCount!: number;

    @prop({ required: true, min: OfferSchemaLimits.MIN_OFFER_PRICE, max: OfferSchemaLimits.MAX_OFFER_PRICE })
    public price!: number;

    @prop({ type: () => [String], required: true, validate: [ validateFacilities, `The offer facilities should be one or more options from this list ${FACILITIES.join(', ')}` ]})
    public facilities!: string[];

    @prop({
      ref: UserEntity,
      required: true,
    })
    public authorId: Ref<UserEntity>;

    @prop({ default: 0 })
    public commentCount!: number;

    @prop({ required: true })
    @Type(() => OfferCoordinates)
    public coordinates!: Coordinates;

}

export const OfferModel = getModelForClass(OfferEntity);
