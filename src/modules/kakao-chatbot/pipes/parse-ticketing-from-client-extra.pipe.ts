import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';
import { TicketingErrorDTOCreator } from '../dtos/error.dto';
import { Result, err, ok } from 'src/core';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';

export type TicketingClientExtraResult<Required extends boolean = false> =
  Result<
    Required extends true
      ? {
          ticket_id: string;
          room_id: string;
        }
      : { ticket_id: string },
    KakaoChatbotResponseDTO
  >;

@Injectable()
export class ParseTicketingFromClientExtraPipe
  implements PipeTransform<KakaoChatbotRequestDTO, TicketingClientExtraResult>
{
  private roomIdRequired = false;
  constructor(options?: { roomIdRequired: boolean }) {
    if (options) this.roomIdRequired = options.roomIdRequired;
  }

  transform(value: KakaoChatbotRequestDTO): TicketingClientExtraResult {
    console.log(value.intent.name, value.action.clientExtra?.ticketing);
    const { ticket_id, room_id } = value.action.clientExtra?.ticketing ?? {};

    if (!ticket_id) {
      console.debug(
        new BadRequestException(
          `ticketing ticket_id not contained in clientExtra`,
        ),
      );

      return err(TicketingErrorDTOCreator.onTicketNotSelected());
    }
    if (this.roomIdRequired && !room_id) {
      console.debug(
        new BadRequestException(
          `ticketing room_id not contained in clientExtra`,
        ),
      );

      return err(TicketingErrorDTOCreator.onRoomNotSelected());
    }

    return ok({
      ticket_id,
      room_id,
    });
  }
}
