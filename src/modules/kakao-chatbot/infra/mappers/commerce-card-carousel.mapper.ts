import { IMapper } from 'src/core';
import {
  COMMERCE_CARD_TYPE,
  CommerceCardCarousel,
} from '../../domain/basic-template-outputs/commerce-card-carousel/commerce-card-carousel.value-object';
import { CommerceCardCarouselDTO } from '../../application/dtos/template-output.interface';
import { CarouselHeaderMapper } from './carousel-header.mapper';
import { CommerceCardMapper } from './commerce-card.mapper';

export class CommerceCardCarouselMapper
  implements IMapper<CommerceCardCarousel>
{
  static toDTO(domain: CommerceCardCarousel): CommerceCardCarouselDTO {
    return {
      type: COMMERCE_CARD_TYPE,
      header: domain.header && CarouselHeaderMapper.toDTO(domain.header),
      items: domain.items.map(CommerceCardMapper.toDTO),
    };
  }
}
