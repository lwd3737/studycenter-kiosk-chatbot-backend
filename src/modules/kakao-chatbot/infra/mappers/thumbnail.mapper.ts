import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { Thumbnail } from '../../domain/thumbnail.value-object';
import { IThumbnailDTO } from '../../dtos/kakao-chatbot-ticket.dto.interface';

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
