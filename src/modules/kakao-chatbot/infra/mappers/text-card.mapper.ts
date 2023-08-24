import { IMapper } from 'src/core';
import { TextCard } from '../../domain/basic-template-outputs/text-card/text-card.vo';
import { TextCardDTO } from '../../application/dtos/ITemplate-output';
import { ButtonMapper } from './button.mapper';

export class TextCardMapper implements IMapper<TextCard> {
  static toDTO(domain: TextCard): TextCardDTO {
    return {
      text: domain.text,
      buttons: domain.buttons?.map(ButtonMapper.toDTO),
    };
  }
}
