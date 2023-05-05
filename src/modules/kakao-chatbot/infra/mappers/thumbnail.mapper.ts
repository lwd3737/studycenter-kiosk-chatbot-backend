import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { ThumbnailDTO } from '../../dtos/template-output.interface';
import { Thumbnail } from '../../domain/base/thumbnail/thumbnail.value-object';

@Injectable()
export class ThumbnailMapper implements IMapper<Thumbnail> {
  toDTO(thumbnail: Thumbnail): ThumbnailDTO {
    const { imageUrl, fixedRatio, width, height } = thumbnail;

    return {
      imageUrl,
      fixedRatio,
      width,
      height,
    };
  }
}
