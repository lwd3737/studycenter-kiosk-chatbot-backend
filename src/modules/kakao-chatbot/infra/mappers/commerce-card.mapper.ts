import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { CommerceCardDTO } from '../../dtos/template-output.interface';
import { ButtonMapper } from './button.mapper';
import { ProfileMapper } from './profile.mapper';
import { ThumbnailMapper } from './thumbnail.mapper';
import { CommerceCard } from '../../domain/base/commerce-card/commerce-card.value-object';

@Injectable()
export class CommerceCardMapper implements IMapper<CommerceCard> {
  constructor(
    private thumbnailMapper: ThumbnailMapper,
    private profileMapper: ProfileMapper,
    private buttonMapper: ButtonMapper,
  ) {}

  toDTO(commerceCard: CommerceCard): CommerceCardDTO {
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
      thumbnails: thumbnails.map(this.thumbnailMapper.toDTO),
      profile: profile ? this.profileMapper.toDTO(profile) : undefined,
      buttons: buttons.map(this.buttonMapper.toDTO),
    };
  }
}
