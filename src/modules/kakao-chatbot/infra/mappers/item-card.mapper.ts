import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { ItemCardDTO } from '../../dtos/template-output.interface';
import { ButtonMapper } from './button.mapper';
import { ThumbnailMapper } from './thumbnail.mapper';
import { ItemCard } from '../../domain/base/item-card/item-card.value-object';

@Injectable()
export class ItemCardMapper implements IMapper<ItemCard> {
  constructor(private thumbnailMapper: ThumbnailMapper) {}

  toDTO(domain: ItemCard): ItemCardDTO {
    return {
      thumbnail: domain.thumbnail
        ? this.thumbnailMapper.toDTO(domain.thumbnail)
        : undefined,
      head: domain.head
        ? {
            title: domain.head.title,
          }
        : undefined,
      imageTitle: domain.imageTitle
        ? {
            title: domain.imageTitle.title,
            description: domain.imageTitle.description,
            imageUrl: domain.imageTitle.imageUrl,
          }
        : undefined,
      itemList: domain.itemList.map((item) => ({
        title: item.title,
        description: item.description,
      })),
      itemListAlignment: domain.itemListAlignment,
      itemListSummary: domain.itemListSummary
        ? {
            title: domain.itemListSummary.title,
            description: domain.itemListSummary.description,
          }
        : undefined,
      title: domain.title,
      description: domain.description,
      buttons: domain.buttons?.map((button) => ButtonMapper.toDTO(button)),
      buttonLayout: domain.buttonLayout,
    };
  }
}
