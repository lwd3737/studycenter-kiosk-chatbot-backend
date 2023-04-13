import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { CommerceCard } from '../../domain/commerce-card/commerce-card.value-object';
import { CommerceCardDTO } from '../../dtos/kakao-chatbot.dto.interface';
import { ButtonMapper } from './button.mapper';
import { ProfileMapper } from './profile.mapper';
import { ThumbnailMapper } from './thumbnail.mapper';

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
