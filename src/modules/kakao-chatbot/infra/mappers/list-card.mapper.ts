import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';

import { ListCardDTO, ListItemDTO } from '../../dtos/template-output.interface';
import { ButtonMapper } from './button.mapper';
import { ListCard } from '../../domain/base/list-card/list-card.value-object';
import { ListHeader } from '../../domain/base/list-card/list-header.value-object';
import { ListItem } from '../../domain/base/list-card/list-item.value-object';

@Injectable()
export class ListCardMapper implements IMapper<ListCard> {
  constructor(private buttonMapper: ButtonMapper) {}

  toDTO(listCard: ListCard): ListCardDTO {
    const { header, items, buttons } = listCard;

    return {
      header: this.toHeaderDTO(header),
      items: items.map((item) => this.toItemDTO(item)),
      buttons: buttons?.map(this.buttonMapper.toDTO),
    };
  }

  toHeaderDTO(listHeader: ListHeader): ListItemDTO {
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

  toItemDTO(listItem: ListItem): ListItemDTO {
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
