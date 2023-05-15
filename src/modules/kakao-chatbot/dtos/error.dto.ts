import { KakaoChatbotResponseDTO } from './response.dto.interface';
import { SkillQuickReply } from './template-output.interface';

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

export class TicketingErrorDTOCreator {
  public static onTicketNotSelected(): KakaoChatbotResponseDTO {
    return ErrorDTOCreator.toSimpleTextOutput('이용권을 먼저 선택해주세요!');
  }

  public static onRoomNotSelected(): KakaoChatbotResponseDTO {
    return ErrorDTOCreator.toSimpleTextOutput('이용할 룸을 먼저 선택해주세요!');
  }

  public static onSeatNotSelected(): KakaoChatbotResponseDTO {
    return ErrorDTOCreator.toSimpleTextOutput(
      '이용할 좌석을 먼저 선택해주세요!',
    );
  }
}
