import { IMapper } from 'src/core';
import { CarouselHeader } from '../../domain/base/carousel/header.value-object';
import { CarouselHeaderDTO } from '../../dtos/template-output.interface';
import { ThumbnailMapper } from './thumbnail.mapper';

export class CarouselHeaderMapper implements IMapper<CarouselHeader> {
  static toDTO(domain: CarouselHeader): CarouselHeaderDTO {
    return {
      title: domain.title,
      description: domain.description,
      thumbnail: ThumbnailMapper.toDTO(domain.thunbnail),
    };
  }
}
