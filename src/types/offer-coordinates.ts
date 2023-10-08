import {
  IsDefined,
  IsLatitude,
  IsLongitude,
  IsString
} from 'class-validator';

export interface Coordinates {
  longitude: string,
  latitude: string
}

export class OfferCoordinates implements Coordinates {
  @IsDefined()
  @IsString()
  @IsLongitude()
  public longitude!: string;

  @IsDefined()
  @IsString()
  @IsLatitude()
  public latitude!: string;
}
