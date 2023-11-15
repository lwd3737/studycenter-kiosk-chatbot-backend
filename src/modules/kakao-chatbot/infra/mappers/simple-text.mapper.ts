import { IMapper } from 'src/core';
import { SimpleTextDTO } from '../../application/dtos/ITemplate-output';
import { SimpleText } from '../../domain/basic-template-outputs/simple-text/simple-text.value-object';

export class SimpleTextMapper implements IMapper<SimpleText> {
  static toDTO(simpleText: SimpleText): SimpleTextDTO {
    return {
      text: simpleText.value,
    };
  }
}
