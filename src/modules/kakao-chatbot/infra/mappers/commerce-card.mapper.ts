import { IMapper } from 'src/core';
import { CommerceCardDTO } from '../../application/dtos/template-output.interface';
import { ButtonMapper } from './button.mapper';
import { ProfileMapper } from './profile.mapper';
import { ThumbnailMapper } from './thumbnail.mapper';
import { CommerceCard } from '../../domain/basic-template-outputs/commerce-card/commerce-card.value-object';

export class CommerceCardMapper implements IMapper<CommerceCard> {
  static toDTO(commerceCard: CommerceCard): CommerceCardDTO {
    const {
      description,
      price,
      currency,
      discount,
      thumbnails,
      profile,
      buttons,
    } = commerceCard;

    return {
      description,
      price,
      discount: discount?.priceToDiscount,
      discountRate: discount?.rate,
      discountedPrice: discount?.discountedPrice,
      currency,
      thumbnails: thumbnails.map(ThumbnailMapper.toDTO),
      profile: profile && ProfileMapper.toDTO(profile),
      buttons: buttons.map(ButtonMapper.toDTO),
    };
  }
}
