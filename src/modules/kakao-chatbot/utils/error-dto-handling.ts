import { KakaoChatbotResponseDTO } from '../dtos/kakao-chatbot-response.dto.interface';
import { SkillQuickReply } from '../dtos/kakao-chatbot.dto.interface';

export class ErrorDTOCreator {
  private static createResponseDTO(): KakaoChatbotResponseDTO {
    return {
      version: '2.0',
      template: {
        outputs: [],
      },
    };
  }

  public static toSimpleTextOutput(
    errorMessage: string,
    quickReplies?: SkillQuickReply[],
  ): KakaoChatbotResponseDTO {
    const responseDTO = this.createResponseDTO();

    responseDTO.template.outputs.push({
      simpleText: {
        text: errorMessage,
      },
    });

    if (quickReplies) {
      responseDTO.template.quickReplies = quickReplies;
    }

    return responseDTO;
  }
}
