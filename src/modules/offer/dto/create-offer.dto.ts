import { OfferCoordinates } from '../../../types/offer-coordinates.js';

import {
  IsDateString,
  MinLength,
  MaxLength,
  IsEnum,
  IsArray,
  IsUrl,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsBoolean,
  Min,
  Max,
  IsInt,
  IsIn,
  IsMongoId,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { OfferSchemaLimits, CITIES, HOUSING_TYPES, FACILITIES } from '../offer.constants.js';
import { offerValidateErrorMessage } from './offer-validate-error-message.js';
import { Type } from 'class-transformer';

export default class CreateOfferDto {

  @MinLength(OfferSchemaLimits.MIN_NAME_LENGTH, {message: offerValidateErrorMessage.name.minLengthMessage })
  @MaxLength(OfferSchemaLimits.MAX_NAME_LENGTH, {message: offerValidateErrorMessage.name.maxLengthMessage })
  public name!: string;

  @MinLength(OfferSchemaLimits.MIN_DESC_LENGTH, {message: offerValidateErrorMessage.description.minLengthMessage })
  @MaxLength(OfferSchemaLimits.MAX_DESC_LENGTH, {message: offerValidateErrorMessage.description.maxLengthMessage })
  public description!: string;

  @IsDateString({}, {message: offerValidateErrorMessage.publishDate.message })
  public publishDate!: string;

  @IsEnum(CITIES, {message: offerValidateErrorMessage.city.message })
  public city!: string;

  @IsUrl({}, {message: offerValidateErrorMessage.prevImageUrl.message })
  public prevImageUrl!: string;

  @IsArray({message: offerValidateErrorMessage.photos.notArrayMessage})
  @ArrayNotEmpty({message: offerValidateErrorMessage.photos.emptyArrayMessage })
  @ArrayMinSize(OfferSchemaLimits.REQUIRED_PHOTOS_COUNT, {message: offerValidateErrorMessage.photos.minArrayLengthMessage })
  @ArrayMaxSize(OfferSchemaLimits.REQUIRED_PHOTOS_COUNT, {message: offerValidateErrorMessage.photos.maxArrayLengthMessage })
  @IsUrl({}, {message: offerValidateErrorMessage.photos.elementShouldBeUrl, each: true })
  public photos!: string[];

  @IsBoolean({ message: offerValidateErrorMessage.isPremium.message })
  public isPremium!: boolean;

  public rating!: number;

  @IsEnum(HOUSING_TYPES, {message: offerValidateErrorMessage.housingType.message })
  public housingType!: string;

  @IsInt({message: offerValidateErrorMessage.roomCount.intMessage })
  @Min(OfferSchemaLimits.MIN_ROOM_COUNT, {message: offerValidateErrorMessage.roomCount.minRoomCountMessage })
  @Max(OfferSchemaLimits.MAX_ROOM_COUNT, {message: offerValidateErrorMessage.roomCount.maxRoomCountMessage })
  public roomCount!: number;

  @IsInt({message: offerValidateErrorMessage.guestCount.message })
  @Min(OfferSchemaLimits.MIN_GUEST_COUNT, {message: offerValidateErrorMessage.guestCount.minGuestCountMessage })
  @Max(OfferSchemaLimits.MAX_GUEST_COUNT, {message: offerValidateErrorMessage.guestCount.maxGuestCountMessage })
  public guestCount!: number;

  @IsInt({message: offerValidateErrorMessage.price.intMessage })
  @Min(OfferSchemaLimits.MIN_OFFER_PRICE, {message: offerValidateErrorMessage.price.minPriceMessage })
  @Max(OfferSchemaLimits.MAX_OFFER_PRICE, {message: offerValidateErrorMessage.price.maxPriceMessage })
  public price!: number;

  @IsArray({message: offerValidateErrorMessage.facilities.isNotArrayMessage })
  @ArrayNotEmpty({ message: offerValidateErrorMessage.facilities.emptyArrayMessage })
  @IsIn(FACILITIES, {message: offerValidateErrorMessage.facilities.incorrectFacilityMessage, each: true })
  public facilities!: string[];

  @IsMongoId({message: offerValidateErrorMessage.authorId.message })
  public authorId!: string;

  public commentCount!: number;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => OfferCoordinates)
  public coordinates!: OfferCoordinates;
}
