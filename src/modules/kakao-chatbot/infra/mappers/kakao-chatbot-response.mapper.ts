import { Injectable } from '@nestjs/common';
import {
  ContextControlDTO,
  KakaoChatbotResponseDTO,
  SkillOutputDTO,
} from '../../dtos/kakao-chatbot-response.dto.interface';

@Injectable()
export class KaKaoChatbotResponseMapper {
  toDTO(domain: {
    outputs: SkillOutputDTO[];
    context?: ContextControlDTO;
    data?: Record<string, any>;
  }): KakaoChatbotResponseDTO {
    const { outputs, context, data } = domain;

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
