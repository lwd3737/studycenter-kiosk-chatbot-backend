import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { CarouselDTO } from '../../dtos/template-output.interface';

import { CommerceCardMapper } from './commerce-card.mapper';
import { ItemCardMapper } from './item-card.mapper';
import {
  Carousel,
  CarouselItem,
  CarouselTypeEnum,
} from '../../domain/base/carousel/carousel.value-object';
import { CommerceCard } from '../../domain/base/commerce-card/commerce-card.value-object';
import { ItemCard } from '../../domain/base/item-card/item-card.value-object';

@Injectable()
export class CarouselMapper implements IMapper<Carousel> {
  constructor(
    private commerceMapper: CommerceCardMapper,
    private itemCardMapper: ItemCardMapper,
  ) {}

  toDTO(carousel: Carousel): CarouselDTO {
    const { type, items } = carousel;

    return {
      type,
      items: items.map((item) => this.toItemDTO(type, item)),
    };
  }

  toItemDTO(type: CarouselTypeEnum, item: CarouselItem): any {
    switch (type) {
      case CarouselTypeEnum.COMMERCE_CARD:
        return this.commerceMapper.toDTO(item as CommerceCard);
      case CarouselTypeEnum.ITEM_CARD:
        return this.itemCardMapper.toDTO(item as ItemCard);
      case CarouselTypeEnum.BASIC_CARD:
        throw new Error('Not implemented yet');
    }
  }
}
