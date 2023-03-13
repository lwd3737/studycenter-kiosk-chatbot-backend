import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { Button } from '../../domain';
import { IButtonDTO } from '../../dtos';

@Injectable()
export class ButtonMapper implements IMapper<Button> {
  toDTO(button: Button): IButtonDTO {
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
