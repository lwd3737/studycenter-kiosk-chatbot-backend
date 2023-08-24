import { IMapper } from 'src/core';
import {
  ListCardDTO,
  ListItemDTO,
} from '../../application/dtos/ITemplate-output';
import { ButtonMapper } from './button.mapper';
import { ListCard } from '../../domain/basic-template-outputs/list-card/list-card.value-object';
import { ListCardHeader } from '../../domain/basic-template-outputs/list-card/header.value-object';
import { ListCardItem } from '../../domain/basic-template-outputs/list-card/item.value-object';

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

  static toItemDTO(domain: ListCardItem): ListItemDTO {
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
