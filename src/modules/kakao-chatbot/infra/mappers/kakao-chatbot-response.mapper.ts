import { Injectable } from '@nestjs/common';
import {
  IContextControlDTO,
  IKakaoChatbotResponseDTO,
  ISkillOutputDTO,
} from '../../dtos/kakao-chatbot-response.dto.interface';

@Injectable()
export class KaKaoChatbotResponseMapper {
  toDTO(payload: {
    outputs: ISkillOutputDTO[];
    context?: IContextControlDTO;
    data?: Record<string, any>;
  }): IKakaoChatbotResponseDTO {
    const { outputs, context, data } = payload;

    return {
      version: '2.0',
      template: {
        outputs,
      },
      context,
      data,
    };
  }
}
