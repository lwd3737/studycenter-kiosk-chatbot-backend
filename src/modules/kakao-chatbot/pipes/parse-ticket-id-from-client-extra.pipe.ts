import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';

@Injectable()
export class ParseTicketIdFromClientExtraPipe
  implements PipeTransform<KakaoChatbotRequestDTO, string | null>
{
  transform(value: KakaoChatbotRequestDTO): string | null {
    const ticketId = value.action.clientExtra.ticketId as string | null;
    if (!ticketId) return null;

    return ticketId;
  }
}
