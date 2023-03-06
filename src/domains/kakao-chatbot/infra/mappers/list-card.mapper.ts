import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { ListCard, ListHeader, ListItem } from '../../domain';
import { IListCardDTO, IListItemDTO } from '../../dtos';

@Injectable()
export class ListCardMapper implements IMapper<ListCard> {
  toDTO(listCard: ListCard): IListCardDTO {
    const { header, items } = listCard;

    return {
      header: this.toHeaderDTO(header),
      items: items.map(this.toItemDTO),
    };
  }

  toHeaderDTO(listHeader: ListHeader): IListItemDTO {
    const { title, imageUrl, action, blockId, messageText, extra } = listHeader;

    return {
      title,
      imageUrl,
      action,
      blockId,
      messageText,
      extra,
    };
  }

  toItemDTO(listItem: ListItem): IListItemDTO {
    const {
      title,
      description,
      imageUrl,
      action,
      blockId,
      messageText,
      extra,
    } = listItem;

    return {
      title,
      description,
      imageUrl,
      action,
      blockId,
      messageText,
      extra,
    };
  }
}
