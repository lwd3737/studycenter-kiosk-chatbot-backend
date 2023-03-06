import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { Button, ListCard, ListHeader, ListItem } from '../../domain';
import { IButtonDTO, IListCardDTO, IListItemDTO } from '../../dtos';

@Injectable()
export class ListCardMapper implements IMapper<ListCard> {
  toDTO(listCard: ListCard): IListCardDTO {
    const { header, items, buttons } = listCard;

    return {
      header: this.toHeaderDTO(header),
      items: items.map((item) => this.toItemDTO(item)),
      buttons: buttons?.map((button) => this.toButtonDTO(button)),
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

  toButtonDTO(button: Button): IButtonDTO {
    const {
      label,
      action,
      webLinkUrl,
      messageText,
      phoneNumber,
      blockId,
      extra,
    } = button;

    return {
      label,
      action,
      webLinkUrl,
      messageText,
      phoneNumber,
      blockId,
      extra,
    };
  }
}
