import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { KakaoChatbotRequestDTO } from '../dtos/request.dto';
import { TicketingErrorDTOCreator } from '../dtos/error.dto';
import { Result, err, ok } from 'src/core';
import { KakaoChatbotResponseDTO } from '../dtos/response.dto.interface';

export type TicketingParamsResult = Result<
  {
    ticket_id: string;
    room_id: string;
    seat_number: string;
  },
  KakaoChatbotResponseDTO
>;

@Injectable()
export class ParseTicketingFromParamsPipe
  implements PipeTransform<KakaoChatbotRequestDTO, TicketingParamsResult>
{
  private SELECT_SEAT_COMMAND_REGEX = /\/(좌석)\s+(\d+)/i;

  transform(value: KakaoChatbotRequestDTO): TicketingParamsResult {
    // command에 공백이 삽입?
    console.log(
      'ticketing',
      value.action.params,
      value.userRequest.utterance,
      value.action.params.select_seat_command.length,
    );
    const { ticket_id, room_id, select_seat_command } = value.action.params;
    const command = value.userRequest.utterance;

    if (!ticket_id) {
      console.debug(
        new BadRequestException('ticket id not contained in params'),
      );
      return err(TicketingErrorDTOCreator.onTicketNotSelected());
    }
    if (!room_id) {
      console.debug(new BadRequestException('room id not contained in params'));
      return err(TicketingErrorDTOCreator.onRoomNotSelected());
    }
    if (!select_seat_command) {
      console.debug(
        new BadRequestException('select seat command not contained in params'),
      );
      return err(TicketingErrorDTOCreator.onSelectSeatNumberCommandNotInput());
    }

    const commandRegex = this.SELECT_SEAT_COMMAND_REGEX.exec(command);
    if (!commandRegex) {
      console.debug(
        new BadRequestException('select seat number command not valid'),
      );
      return err(TicketingErrorDTOCreator.onSelectSeatNumberCommandNotValid());
    }
    const seatNumber = commandRegex[2];

    return ok({
      ticket_id,
      room_id,
      seat_number: seatNumber,
    });
  }
}
