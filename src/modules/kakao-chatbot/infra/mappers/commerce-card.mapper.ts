import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { CommerceCard } from '../../domain';
import { ICommerceCardDTO } from '../../dtos';
import { ButtonMapper } from './button.mapper';
import { ThumbnailMapper } from './thumbnail.mapper';

@Injectable()
export class CommerceCardMapper implements IMapper<CommerceCard> {
  constructor(
    private thumbnailMapper: ThumbnailMapper,
    private buttonMapper: ButtonMapper,
  ) {}

  toDTO(commerceCard: CommerceCard): ICommerceCardDTO {
    const { description, price, currency, discount, thumbnails, buttons } =
      commerceCard;

    return {
      description,
      price,
      discount: discount?.priceToDiscount,
      discountRate: discount?.rate,
      discountedPrice: discount?.discountedPrice,
      currency,
      thumbnails: thumbnails.map(this.thumbnailMapper.toDTO),
      buttons: buttons.map(this.buttonMapper.toDTO),
    };
  }
}
