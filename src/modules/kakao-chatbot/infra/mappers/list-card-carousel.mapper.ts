import { IMapper } from 'src/core';
import { ListCardCarousel } from '../../domain/basic-template-outputs/list-card-carousel/list-card-carousel.value-object';
import { ListCardCarouselDTO } from '../../application/dtos/template-output.interface';
import { ListCardMapper } from './list-card.mapper';

export class ListCardCarouselMapper implements IMapper<ListCardCarousel> {
  static toDTO(domain: ListCardCarousel): ListCardCarouselDTO {
    return {
      type: domain.type,
      items: domain.items.map(ListCardMapper.toDTO),
    };
  }
}
