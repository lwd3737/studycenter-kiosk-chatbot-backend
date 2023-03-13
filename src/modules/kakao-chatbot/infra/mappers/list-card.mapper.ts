import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { ListCard, ListHeader, ListItem } from '../../domain';
import { IListCardDTO, IListItemDTO } from '../../dtos';
import { ButtonMapper } from './button.mapper';

@Injectable()
export class ListCardMapper implements IMapper<ListCard> {
  constructor(private buttonMapper: ButtonMapper) {}

  toDTO(listCard: ListCard): IListCardDTO {
    const { header, items, buttons } = listCard;

    return {
      header: this.toHeaderDTO(header),
      items: items.map((item) => this.toItemDTO(item)),
      buttons: buttons?.map(this.buttonMapper.toDTO),
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
