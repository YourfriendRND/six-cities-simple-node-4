import {
  IsDefined,
  IsLatitude,
  IsLongitude,
  IsString
} from 'class-validator';

export interface Coordinates {
  longtitude: string,
  latitude: string
}

export class OfferCoordinates implements Coordinates {
  @IsDefined()
  @IsString()
  @IsLongitude()
  public longtitude!: string;

  @IsDefined()
  @IsString()
  @IsLatitude()
  public latitude!: string;
}
