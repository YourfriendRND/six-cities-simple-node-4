import { Offer } from '../../types/offer.type';

export const convertFileLineToOffer = (offerRowLine: string): Offer => {
  const [
    name,
    description,
    publishDate,
    city,
    prevImageUrl,
    photos,
    isPremium,
    rating,
    housingType,
    roomCount,
    guestCount,
    price,
    facilities,
    authorName,
    authorEmail,
    authorAvatarUrl,
    authorStatus,
    commentCount,
    coordinates,
    isActive
  ] = offerRowLine.replace('\n', '').split('\t');

  const [longitude, latitude] = coordinates.split(';');

  return {
    name,
    description,
    publishDate,
    city,
    prevImageUrl,
    photos: photos.split(';'),
    isPremium: Boolean(isPremium),
    rating: Number(rating),
    housingType,
    roomCount: Number(roomCount),
    guestCount: Number(guestCount),
    price: Number(price),
    facilities: facilities.split(';'),
    author: {
      name: authorName,
      email: authorEmail,
      avatarUrl: authorAvatarUrl,
      isPro: Boolean(authorStatus),
    },
    commentCount: Number(commentCount),
    coordinates: {
      longitude,
      latitude
    },
    isActive: Boolean(isActive)
  };
};
