import { IMapper } from 'src/core';
import { Button } from '../../domain/base/button/button.value-object';
import { ButtonDTO } from '../../dtos/template-output.interface';

export class ButtonMapper implements IMapper<Button> {
  static toDTO(domain: Button): ButtonDTO {
    return {
      label: domain.label,
      action: domain.action,
      webLinkUrl: domain.webLinkUrl,
      messageText: domain.messageText,
      phoneNumber: domain.phoneNumber,
      blockId: domain.blockId,
      extra: domain.extra,
    };
  }
}
