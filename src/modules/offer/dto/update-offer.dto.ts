import {
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsUrl,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsBoolean,
  Min,
  Max,
  IsInt,
  IsIn,
  IsObject,
  ValidateNested,
  IsOptional,
  IsEmpty,
  IsNotEmptyObject
} from 'class-validator';
import { OfferCoordinates } from '../../../types/offer-coordinates.js';
import { OfferSchemaLimits } from '../offer.constants.js';
import { offerValidateErrorMessage } from './offer-validate-error-message.js';
import { CITIES, HOUSING_TYPES, FACILITIES } from '../offer.constants.js';
import { Type } from 'class-transformer';

export default class UpdateOfferDto {

  @IsOptional()
  @MinLength(OfferSchemaLimits.MIN_NAME_LENGTH, {message: offerValidateErrorMessage.name.minLengthMessage })
  @MaxLength(OfferSchemaLimits.MAX_NAME_LENGTH, {message: offerValidateErrorMessage.name.maxLengthMessage })
  public name?: string;

  @IsOptional()
  @MinLength(OfferSchemaLimits.MIN_DESC_LENGTH, {message: offerValidateErrorMessage.description.minLengthMessage })
  @MaxLength(OfferSchemaLimits.MAX_DESC_LENGTH, {message: offerValidateErrorMessage.description.maxLengthMessage })
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: offerValidateErrorMessage.publishDate.message })
  public publishDate?: string;

  @IsOptional()
  @IsEnum(CITIES, {message: offerValidateErrorMessage.city.message })
  public city?: string;

  @IsOptional()
  @IsUrl({}, {message: offerValidateErrorMessage.prevImageUrl.message })
  public prevImageUrl?: string;

  @IsOptional()
  @IsArray({message: offerValidateErrorMessage.photos.notArrayMessage})
  @ArrayNotEmpty({message: offerValidateErrorMessage.photos.emptyArrayMessage })
  @ArrayMinSize(OfferSchemaLimits.REQUIRED_PHOTOS_COUNT, {message: offerValidateErrorMessage.photos.minArrayLengthMessage })
  @ArrayMaxSize(OfferSchemaLimits.REQUIRED_PHOTOS_COUNT, {message: offerValidateErrorMessage.photos.maxArrayLengthMessage })
  @IsUrl({}, {message: offerValidateErrorMessage.photos.elementShouldBeUrl, each: true })
  public photos?: string[];

  @IsOptional()
  @IsBoolean({ message: offerValidateErrorMessage.isPremium.message })
  public isPremium?: boolean;

  @IsOptional()
  @IsEmpty({message: offerValidateErrorMessage.rating.message})
  public rating?: number;

  @IsOptional()
  @IsEnum(HOUSING_TYPES, {message: offerValidateErrorMessage.housingType.message })
  public housingType?: string;

  @IsOptional()
  @IsInt({message: offerValidateErrorMessage.roomCount.intMessage })
  @Min(OfferSchemaLimits.MIN_ROOM_COUNT, {message: offerValidateErrorMessage.roomCount.minRoomCountMessage })
  @Max(OfferSchemaLimits.MAX_ROOM_COUNT, {message: offerValidateErrorMessage.roomCount.maxRoomCountMessage })
  public roomCount?: number;

  @IsOptional()
  @IsInt({message: offerValidateErrorMessage.guestCount.message })
  @Min(OfferSchemaLimits.MIN_GUEST_COUNT, {message: offerValidateErrorMessage.guestCount.minGuestCountMessage })
  @Max(OfferSchemaLimits.MAX_GUEST_COUNT, {message: offerValidateErrorMessage.guestCount.maxGuestCountMessage })
  public guestCount?: number;

  @IsOptional()
  @IsInt({message: offerValidateErrorMessage.price.intMessage })
  @Min(OfferSchemaLimits.MIN_OFFER_PRICE, {message: offerValidateErrorMessage.price.minPriceMessage })
  @Max(OfferSchemaLimits.MAX_OFFER_PRICE, {message: offerValidateErrorMessage.price.maxPriceMessage })
  public price?: number;

  @IsOptional()
  @IsArray({message: offerValidateErrorMessage.facilities.isNotArrayMessage })
  @ArrayNotEmpty({ message: offerValidateErrorMessage.facilities.emptyArrayMessage })
  @IsIn(FACILITIES, {message: offerValidateErrorMessage.facilities.incorrectFacilityMessage, each: true })
  public facilities?: string[];

  @IsOptional()
  @IsEmpty({message: offerValidateErrorMessage.commentCount.message})
  public commentCount?: number;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => OfferCoordinates)
  public coordinates?: OfferCoordinates;
}
