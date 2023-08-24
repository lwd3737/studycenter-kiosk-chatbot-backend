import { IMapper } from 'src/core';
import { CarouselHeader } from '../../domain/basic-template-outputs/carousel/header.value-object';
import { CarouselHeaderDTO } from '../../application/dtos/ITemplate-output';
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
