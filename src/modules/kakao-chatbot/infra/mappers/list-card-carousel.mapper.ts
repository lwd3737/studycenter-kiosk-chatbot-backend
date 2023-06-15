import { IMapper } from 'src/core';
import { ListCardCarousel } from '../../domain/base/list-card-carousel/list-card-carousel.value-object';
import { ListCardCarouselDTO } from '../../dtos/template-output.interface';
import { ListCardMapper } from './list-card.mapper';

export class ListCardCarouselMapper implements IMapper<ListCardCarousel> {
  static toDTO(domain: ListCardCarousel): ListCardCarouselDTO {
    return {
      type: domain.type,
      items: domain.items.map(ListCardMapper.toDTO),
    };
  }
}
