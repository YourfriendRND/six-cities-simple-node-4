import { User } from './user.type';
import { OfferCoordinates } from './offer-coordinates.js';

// export type OfferCoordinates = {
//   longtitude: string;
//   latitude: string;
// };

export type Offer = {
  id?: string;
  name: string;
  description: string;
  publishDate: string;
  city: string;
  prevImageUrl: string;
  photos: string[];
  isPremium: boolean;
  rating: number;
  housingType: string;
  roomCount: number;
  guestCount: number;
  price: number;
  facilities: string[];
  author: User;
  commentCount: number;
  coordinates: OfferCoordinates;
};
