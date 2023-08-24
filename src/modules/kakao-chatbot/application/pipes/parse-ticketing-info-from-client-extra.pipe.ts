import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';
import { TicketingErrorDTOCreator } from '../dtos/ticketing-error.dto';
import { Result, err, ok } from 'src/core';
import { KakaoChatbotResponseDTO } from '../dtos/IResponse.dto';

export type TicketingInfoClientExtraResult<
  R extends RequiredFields = DefaultFields,
> = Result<
  {
    ticketId: string;
    roomId: R['roomId'] extends true ? string : string | undefined;
    seatId: R['seatId'] extends true ? string : string | undefined;
  },
  KakaoChatbotResponseDTO
>;
type RequiredFields = {
  roomId?: boolean;
  seatId?: boolean;
};
type DefaultFields = {
  roomId: false;
  seatId: false;
};

@Injectable()
export class ParseTicketingInfoFromClientExtraPipe<
  R extends RequiredFields = DefaultFields,
> implements
    PipeTransform<KakaoChatbotRequestDTO, TicketingInfoClientExtraResult<R>>
{
  constructor(private required: R = { roomId: false, seatId: false } as R) {}

  transform(value: KakaoChatbotRequestDTO): TicketingInfoClientExtraResult<R> {
    const { ticket_id, room_id, seat_id } =
      value.action.clientExtra?.ticketing ?? {};

    if (!ticket_id) {
      console.debug(
        new BadRequestException(`ticket_id not contained in clientExtra`),
      );
      return err(TicketingErrorDTOCreator.onTicketNotSelected());
    }
    if (this.required?.roomId && !room_id) {
      console.debug(
        new BadRequestException(`room_id not contained in clientExtra`),
      );
      return err(TicketingErrorDTOCreator.onRoomNotSelected());
    }
    if (this.required?.seatId && !seat_id) {
      console.debug(
        new BadRequestException(`seat_id not contained in clientExtra`),
      );
      return err(TicketingErrorDTOCreator.onSeatNotSelected());
    }

    return ok({
      ticketId: ticket_id,
      roomId: room_id,
      seatId: seat_id,
    });
  }
}
