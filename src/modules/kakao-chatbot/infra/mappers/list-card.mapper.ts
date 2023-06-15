import { IMapper } from 'src/core';
import { ListCardDTO, ListItemDTO } from '../../dtos/template-output.interface';
import { ButtonMapper } from './button.mapper';
import { ListCard } from '../../domain/base/list-card/list-card.value-object';
import { ListCardHeader } from '../../domain/base/list-card/header.value-object';
import { ListItem } from '../../domain/base/list-card/item.value-object';

export class ListCardMapper implements IMapper<ListCard> {
  static toDTO(domain: ListCard): ListCardDTO {
    return {
      header: ListCardMapper.toHeaderDTO(domain.header),
      items: domain.items.map(ListCardMapper.toItemDTO),
      buttons: domain.buttons?.map(ButtonMapper.toDTO),
    };
  }

  static toHeaderDTO(domain: ListCardHeader): ListItemDTO {
    return {
      title: domain.title,
      imageUrl: domain.imageUrl,
      action: domain.action,
      blockId: domain.blockId,
      messageText: domain.messageText,
      extra: domain.extra,
    };
  }

  static toItemDTO(domain: ListItem): ListItemDTO {
    return {
      title: domain.title,
      description: domain.description,
      imageUrl: domain.imageUrl,
      action: domain.action,
      blockId: domain.blockId,
      messageText: domain.messageText,
      extra: domain.extra,
    };
  }
}
