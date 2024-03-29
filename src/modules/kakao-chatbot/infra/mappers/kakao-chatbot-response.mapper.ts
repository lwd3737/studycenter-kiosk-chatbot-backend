import {
  ContextControlDTO,
  KakaoChatbotResponseDTO,
  SkillOutputDTO,
} from '../../application/dtos/IResponse.dto';

export class KaKaoChatbotResponseMapper {
  static toDTO(domain: {
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
