import { IMapper } from 'src/core';
import { ThumbnailDTO } from '../../application/dtos/ITemplate-output';
import { Thumbnail } from '../../domain/basic-template-outputs/thumbnail/thumbnail.value-object';

export class ThumbnailMapper implements IMapper<Thumbnail> {
  static toDTO(domain: Thumbnail): ThumbnailDTO {
    return {
      imageUrl: domain.imageUrl,
      fixedRatio: domain.fixedRatio,
      width: domain.width,
      height: domain.height,
    };
  }
}
