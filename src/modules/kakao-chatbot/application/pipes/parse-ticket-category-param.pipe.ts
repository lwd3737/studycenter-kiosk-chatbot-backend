import { Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';
import { ErrorDTOCreator } from '../dtos/error.dto';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';
import { TicketTemplateDTOCreator } from '../dtos/ticket-template.dto';
import {
  HoursRechargeTicketType,
  PeriodTicketType,
  SameDayTicketType,
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
        return PeriodTicketType.create();
      case '시간권':
      case '시간충전권':
        return HoursRechargeTicketType.create();
      case '당일권':
      case '1일권':
        return SameDayTicketType.create();
      default:
        console.debug(`Value of ticket_category '${type}' is invalid`);

        return ErrorDTOCreator.toSimpleTextOutput(
          `${type}은(는) 유효하지 않은 이용권 종류입니다. 다시 선택해주세요.`,
          TicketTemplateDTOCreator.toTicketTypesQuickReplies(),
        );
    }
  }
}
