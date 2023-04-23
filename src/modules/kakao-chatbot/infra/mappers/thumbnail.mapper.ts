import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { Thumbnail } from '../../domain/thumbnail/thumbnail.value-object';
import { ThumbnailDTO } from '../../dtos/template-output.interface';

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
