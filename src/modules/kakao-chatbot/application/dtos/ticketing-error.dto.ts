import { ErrorDTOCreator } from './error.dto';
import { KakaoChatbotResponseDTO } from './IResponse.dto';

export class TicketingErrorDTOCreator extends ErrorDTOCreator {
  public static onTicketNotSelected(): KakaoChatbotResponseDTO {
    return this.toSimpleTextOutput('이용권을 먼저 선택해주세요!');
  }

  public static onRoomNotSelected(): KakaoChatbotResponseDTO {
    return this.toSimpleTextOutput('이용할 룸을 먼저 선택해주세요!');
  }

  public static onSeatNotSelected(): KakaoChatbotResponseDTO {
    return this.toSimpleTextOutput('이용할 좌석을 먼저 선택해주세요!');
  }
}
