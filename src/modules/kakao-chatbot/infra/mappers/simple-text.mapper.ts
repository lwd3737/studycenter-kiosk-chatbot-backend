import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/core';
import { SimpleText } from '../../domain/simple-text/simple-text.value-object';
import { SimpleTextDTO } from '../../dtos/kakao-chatbot-ticket.dto.interface';

@Injectable()
export class SimpleTextMapper implements IMapper<SimpleText> {
  toDTO(simpleText: SimpleText): SimpleTextDTO {
    return {
      text: simpleText.text,
    };
  }
}
