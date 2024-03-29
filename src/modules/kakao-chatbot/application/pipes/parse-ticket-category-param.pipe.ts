import { Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { KakaoChatbotResponseDTO } from '../dtos/IResponse.dto';
import { TicketTemplateDTOCreator } from '../dtos/ticket-template.dto';
import {
  HOURS_RECHARGE_TICKET_TYPE,
  PERIOD_TICKET_TYPE,
  SAME_DAY_TICKET_TYPE,
  TicketType,
} from 'src/modules/ticketing';

@Injectable()
export class ParseTicketTypeParamPipe
  implements
    PipeTransform<KakaoChatbotRequestDTO, TicketType | KakaoChatbotResponseDTO>
{
  transform(value: KakaoChatbotRequestDTO) {
    const type = value.action.params['ticket_type'];
    if (!type) {
      console.debug('ticket_ticket param is not included');

      return ErrorDTOCreator.toSimpleTextOutput(
        `유효하지 않은 이용권입니다.`,
        TicketTemplateDTOCreator.toTicketTypesQuickReplies(),
      );
    }

    switch (type) {
      case '정기권':
      case '기간권':
        return PERIOD_TICKET_TYPE;
      case '시간권':
      case '시간충전권':
        return HOURS_RECHARGE_TICKET_TYPE;
      case '당일권':
      case '1일권':
        return SAME_DAY_TICKET_TYPE;
      default:
        console.debug(`Value of ticket_category '${type}' is invalid`);

        return ErrorDTOCreator.toSimpleTextOutput(
          `${type}은(는) 유효하지 않은 이용권 종류입니다. 다시 선택해주세요.`,
          TicketTemplateDTOCreator.toTicketTypesQuickReplies(),
        );
    }
  }
}
