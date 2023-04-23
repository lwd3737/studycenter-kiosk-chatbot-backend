import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';

@Injectable()
export class ParseTicketIdFromClientExtraPipe
  implements PipeTransform<KakaoChatbotRequestDTO, string>
{
  transform(value: KakaoChatbotRequestDTO): string {
    const ticketId = value.action.clientExtra.ticketId as string | undefined;
    if (!ticketId) {
      throw new BadRequestException(`ticketId is not included in clientExtra`);
    }

    return ticketId;
  }
}
