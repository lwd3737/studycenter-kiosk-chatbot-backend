import { IMapper } from 'src/core';
import { ThumbnailDTO } from '../../dtos/template-output.interface';
import { Thumbnail } from '../../domain/base/thumbnail/thumbnail.value-object';

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
