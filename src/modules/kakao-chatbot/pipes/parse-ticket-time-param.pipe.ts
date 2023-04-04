import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { DomainError, Result } from 'src/core';
import {
  TicketTime,
  TicketTimeUnitEnum,
} from '../domain/ticket-time/ticket-time.value-object';

import { KakaoChatbotRequestDTO } from '../dtos/kakao-chatbot-request.dto';

@Injectable()
export class ParseTicketTimeParamPipe
  implements PipeTransform<KakaoChatbotRequestDTO, TicketTime>
{
  transform(value: KakaoChatbotRequestDTO) {
    const ticketParam = value.action.params['ticket'];
    let ticketTimeResult: Result<TicketTime, DomainError>;

    switch (ticketParam) {
      case '15일권':
      case '15일':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.DAYS,
          value: 15,
        });
        break;
      case '30일권':
      case '30일':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.DAYS,
          value: 30,
        });
        break;
      case '50시간권':
      case '50시간':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.HOURS,
          value: 50,
        });
        break;
      case '100시간권':
      case '100시간':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.HOURS,
          value: 100,
        });
        break;
      case '1시간권':
      case '1시간':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.HOURS,
          value: 1,
        });
        break;
      case '2시간권':
      case '2시간':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.HOURS,
          value: 2,
        });
        break;
      case '4시간권':
      case '4시간':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.HOURS,
          value: 4,
        });
        break;
      case '6시간권':
      case '6시간':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.HOURS,
          value: 6,
        });
        break;
      case '9시간권':
      case '9시간':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.HOURS,
          value: 9,
        });
        break;
      case '12시간권':
      case '12시간':
        ticketTimeResult = TicketTime.create({
          unit: TicketTimeUnitEnum.HOURS,
          value: 12,
        });
        break;
      default:
        throw new BadRequestException(
          `ticket param '${ticketParam}' is invalid`,
        );
    }

    if (ticketTimeResult.isErr()) {
      const error = ticketTimeResult.error;
      console.debug(error);

      throw new BadRequestException(error.message);
    }

    return ticketTimeResult.value;
  }
}
