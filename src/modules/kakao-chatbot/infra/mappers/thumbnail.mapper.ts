import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { Thumbnail } from '../../domain';
import { IThumbnailDTO } from '../../dtos';

@Injectable()
export class ThumbnailMapper implements IMapper<Thumbnail> {
  toDTO(thumbnail: Thumbnail): IThumbnailDTO {
    const { imageUrl, fixedRatio, width, height } = thumbnail;

    return {
      imageUrl,
      fixedRatio,
      width,
      height,
    };
  }
}
