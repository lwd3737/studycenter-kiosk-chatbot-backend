import { Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';
import { TicketTemplateDTOCreator } from '../dtos/ticket-template.dto';

@Injectable()
export class ParseTicketCategoryParamPipe
  implements
    PipeTransform<KakaoChatbotRequestDTO, string | KakaoChatbotResponseDTO>
{
  transform(value: KakaoChatbotRequestDTO) {
    const category = value.action.params['ticket_category'];
    if (!category) {
      console.debug('ticket_category param is not included');

      return ErrorDTOCreator.toSimpleTextOutput(
        `이용권 종류를 선택해주세요.`,
        TicketTemplateDTOCreator.toTicketCategoriesQuickReplies(),
      );
    }

    switch (category) {
      case '정기권':
      case '기간권':
        return 'PERIOD';
      case '시간권':
      case '시간충전권':
        return 'HOURS_RECHARGE';
      case '당일권':
      case '1일권':
        return 'SAME_DAY';
      default:
        console.debug(`Value of ticket_category '${category}' is invalid`);

        return ErrorDTOCreator.toSimpleTextOutput(
          `${category}은(는) 유효하지 않은 이용권 종류입니다. 다시 선택해주세요.`,
          TicketTemplateDTOCreator.toTicketCategoriesQuickReplies(),
        );
    }
  }
}
