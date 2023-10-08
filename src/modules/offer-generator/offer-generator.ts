import { getRandomItem, getRandomDate, getRandomItems, getRandomFlag, getRandomInt, getExactCountItems } from '../../core/helpers/index.js';
import { OfferLimits } from './offer-generator.constants.js';
import { MockOffer } from '../../types/mock.type';
import { OfferGeneratorInterface } from './offer-generator.interface';

export default class OfferGenerator implements OfferGeneratorInterface {

  constructor(private readonly mockOffers: MockOffer) {}

  public generate = (): string => {
    const placeName = getRandomItem<string>(this.mockOffers.names);
    const placeDescription = getRandomItem<string>(this.mockOffers.descriptions);
    const publishOfferDateTime = getRandomDate();
    const cityName = getRandomItem<string>(this.mockOffers.cities);
    const preview = getRandomItem<string>(this.mockOffers.photos);
    const offerPhotos = getExactCountItems<string>(this.mockOffers.photos, OfferLimits.PHOTOS_COUNT).join(';');
    const isPremiumOffer = getRandomFlag() ? 'Premium' : '';
    const rating = getRandomInt(1, OfferLimits.MAX_OFFER_RATING);
    const housingType = getRandomItem(this.mockOffers.types);
    const roomCount = getRandomInt(1, OfferLimits.MAX_ROOM_COUNT);
    const guestCount = getRandomInt(1, OfferLimits.MAX_GUEST_COUNT);
    const price = getRandomInt(OfferLimits.MIN_RANDOM_PRICE, OfferLimits.MAX_RANDOM_PRICE);
    const facilities = getRandomItems<string>(this.mockOffers.facilities).join(';');
    const commentCount = 0;
    const userName = getRandomItem<string>(this.mockOffers.people);
    const userEmail = getRandomItem<string>(this.mockOffers.emails);
    const userAvatar = getRandomItem<string>(this.mockOffers.avatars);
    const userStatus = getRandomFlag() ? 'pro' : '';
    const coordinates = [
      getRandomItem<string>(this.mockOffers.coordinates[cityName].latitude),
      getRandomItem<string>(this.mockOffers.coordinates[cityName].longitude)
    ].join(';');
    const isActiveOffer = getRandomFlag() ? 'active' : '';

    return [
      placeName, placeDescription, publishOfferDateTime, cityName,
      preview, offerPhotos, isPremiumOffer, rating, housingType,
      roomCount, guestCount, price, facilities, userName, userEmail,
      userAvatar, userStatus, commentCount, coordinates, isActiveOffer
    ].join('\t');
  };

}
