import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';
import { TicketingErrorDTOCreator } from '../dtos/error.dto';
import { Result, err, ok } from 'src/core';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';

export type TicketingClientExtraResult = Result<
  {
    ticket_id: string;
    room_id?: string;
    seat_id?: string;
  },
  KakaoChatbotResponseDTO
>;

@Injectable()
export class ParseTicketingFromClientExtraPipe
  implements PipeTransform<KakaoChatbotRequestDTO, TicketingClientExtraResult>
{
  private required = {
    room_id: false,
    seat_id: false,
  };
  constructor(options?: {
    required?: { room_id?: boolean; seat_id?: boolean };
  }) {
    if (options?.required)
      this.required = { ...this.required, ...options.required };
  }

  transform(value: KakaoChatbotRequestDTO): TicketingClientExtraResult {
    const { ticket_id, room_id, seat_id } =
      value.action.clientExtra?.ticketing ?? {};

    if (!ticket_id) {
      console.debug(
        new BadRequestException(
          `ticketing ticket_id not contained in clientExtra`,
        ),
      );
      return err(TicketingErrorDTOCreator.onTicketNotSelected());
    }
    if (this.required.room_id && !room_id) {
      console.debug(
        new BadRequestException(
          `ticketing room_id not contained in clientExtra`,
        ),
      );
      return err(TicketingErrorDTOCreator.onRoomNotSelected());
    }
    if (this.required.seat_id && !seat_id) {
      console.debug(
        new BadRequestException(
          `ticketing seat_id not contained in clientExtra`,
        ),
      );
      return err(TicketingErrorDTOCreator.onSeatNotSelected());
    }

    return ok({
      ticket_id,
      room_id,
      seat_id,
    });
  }
}