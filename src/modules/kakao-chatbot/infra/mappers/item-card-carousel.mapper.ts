import { ItemCardCarousel } from '../../domain/basic-template-outputs/item-card-carousel/item-card-carousel.value-object';
import { ItemCardCarouselDTO } from '../../application/dtos/ITemplate-output';
import { CarouselHeaderMapper } from './carousel-header.mapper';
import { ItemCardMapper } from './item-card.mapper';

export class ItemCardCarouselMapper {
  static toDTO(domain: ItemCardCarousel): ItemCardCarouselDTO {
    return {
      type: domain.type,
      header: domain.header && CarouselHeaderMapper.toDTO(domain.header),
      items: domain.items.map(ItemCardMapper.toDTO),
    };
  }
}
