import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TicketCategoryEnum } from 'src/modules/ticketing/domain/ticket/ticket-category.value-object';
import { KakaoChatbotRequestDTO } from '../dtos/kakao-chatbot-request.dto';

@Injectable()
export class ParseTicketCategoryParamPipe
  implements PipeTransform<KakaoChatbotRequestDTO, TicketCategoryEnum>
{
  transform(value: KakaoChatbotRequestDTO) {
    const category = value.action.params['ticket_category'];
    if (!category) {
      throw new BadRequestException(`ticket_category param is not included`);
    }

    switch (category) {
      case '정기권':
        return TicketCategoryEnum.PERIOD;
      case '시간권':
        return TicketCategoryEnum.HOURS_RECHARGE;
      case '당일권':
        return TicketCategoryEnum.SAME_DAY;
      default:
        throw new BadRequestException(
          `Value of ticket_category '${category}' is invalid`,
        );
    }
  }
}
