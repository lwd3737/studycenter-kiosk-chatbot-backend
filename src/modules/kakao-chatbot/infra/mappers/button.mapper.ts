import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { Button } from '../../domain/button/button.value-object';
import { ButtonDTO } from '../../dtos/kakao-chatbot-ticket.dto.interface';

@Injectable()
export class ButtonMapper implements IMapper<Button> {
  toDTO(button: Button): ButtonDTO {
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
