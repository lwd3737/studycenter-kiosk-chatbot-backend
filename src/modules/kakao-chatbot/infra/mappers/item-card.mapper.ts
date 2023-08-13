import { ItemCardDTO } from '../../application/dtos/template-output.interface';
import { ButtonMapper } from './button.mapper';
import { ThumbnailMapper } from './thumbnail.mapper';
import { ItemCard } from '../../domain/basic-template-outputs/item-card/item-card.value-object';

export class ItemCardMapper {
  static toDTO(domain: ItemCard): ItemCardDTO {
    return {
      thumbnail: domain.thumbnail
        ? ThumbnailMapper.toDTO(domain.thumbnail)
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
