import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import {
  Carousel,
  CarouselItem,
  CarouselTypeEnum,
} from '../../domain/carousel/carousel.value-object';
import { CommerceCard } from '../../domain/commerce-card/commerce-card.value-object';
import { ListCard } from '../../domain/list-card/list-card.value-object';
import {
  ICarouselDTO,
  ICarouselItemDTO,
} from '../../dtos/kakao-chatbot-ticket.dto.interface';

import { CommerceCardMapper } from './commerce-card.mapper';
import { ListCardMapper } from './list-card.mapper';

@Injectable()
export class CarouselMapper implements IMapper<Carousel> {
  constructor(
    private listCardMapper: ListCardMapper,
    private commerceMapper: CommerceCardMapper,
  ) {}

  toDTO(carousel: Carousel): ICarouselDTO {
    const { type, items } = carousel;

    return {
      type,
      items: items.map((item) => this.toItemDTO(type, item)),
    };
  }

  toItemDTO(type: CarouselTypeEnum, item: CarouselItem): ICarouselItemDTO {
    switch (type) {
      case CarouselTypeEnum.LIST_CARD:
        return this.listCardMapper.toDTO(item as ListCard);
      case CarouselTypeEnum.COMMERCE_CARD:
        return this.commerceMapper.toDTO(item as CommerceCard);
      case CarouselTypeEnum.BASIC_CARD:

      case CarouselTypeEnum.ITEM_CARD:
        throw new Error(`Carousel '${type}' is not implemented yet`);
    }
  }
}
