import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { ListCard } from '../../domain/list-card/list-card.value-object';
import { ListHeader } from '../../domain/list-card/list-header.value-object';
import { ListItem } from '../../domain/list-card/list-item.value-object';
import {
  ListCardDTO,
  ListItemDTO,
} from '../../dtos/kakao-chatbot-ticket.dto.interface';
import { ButtonMapper } from './button.mapper';

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
