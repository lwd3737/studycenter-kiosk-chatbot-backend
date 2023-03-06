import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import {
  Carousel,
  CarouselItem,
  CarouselTypeEnum,
} from '../../domain/carousel';
import { ICarouselDTO, ICarouselItemDTO } from '../../dtos';
import { ListCardMapper } from './list-card.mapper';

@Injectable()
export class CarouselMapper implements IMapper<Carousel> {
  constructor(private listCardMapper: ListCardMapper) {}

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
        return this.listCardMapper.toDTO(item);
      case CarouselTypeEnum.BASIC_CARD:
      case CarouselTypeEnum.COMMERCE_CARD:
      case CarouselTypeEnum.ITEM_CARD:
        throw new Error(`Carousel '${type}' is not implemented yet`);
    }
  }
}
