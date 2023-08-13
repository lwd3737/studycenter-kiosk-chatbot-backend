import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { SimpleTextDTO } from '../../application/dtos/template-output.interface';
import { SimpleText } from '../../domain/basic-template-outputs/simple-text/simple-text.value-object';

@Injectable()
export class SimpleTextMapper implements IMapper<SimpleText> {
  toDTO(simpleText: SimpleText): SimpleTextDTO {
    return {
      text: simpleText.value,
    };
  }
}
