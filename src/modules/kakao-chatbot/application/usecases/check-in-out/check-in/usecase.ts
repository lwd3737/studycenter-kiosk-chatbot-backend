import { Injectable } from '@nestjs/common';
import { IUseCase, Result, err, ok } from 'src/core';
import { CheckInOutService, MyTicketService } from 'src/modules/my-page';
import {
  CheckInErrors,
  MyTicketNotFoundError,
  SeatNotFoundError,
} from './error';
import { SimpleText } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/simple-text/simple-text.value-object';
import { SeatService } from 'src/modules/seat-management/services/seat.service';
import { SeatId } from 'src/modules/seat-management/domain/seat/seat-id';

type UseCaseInput = {
  appUserId: string;
  myTicketId: string;
  seatId: string;
};
type UseCaseResult = Result<SimpleText, CheckInErrors>;

@Injectable()
export class CheckInUseCase implements IUseCase<UseCaseInput, UseCaseResult> {
  constructor(
    private myTicketService: MyTicketService,
    private checkInOutService: CheckInOutService,
    private seatService: SeatService,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const foundMyTicket = await this.myTicketService.findOneById(
      input.myTicketId,
    );
    if (!foundMyTicket) return err(new MyTicketNotFoundError(input.myTicketId));

    const startedOrError = await this.checkInOutService.checkIn(
      foundMyTicket,
      input.appUserId,
      input.seatId,
    );
    if (startedOrError.isErr()) return err(startedOrError.error);

    const seatInfo = await this.seatService.findSeatInfoById(
      new SeatId(input.seatId),
    );
    if (!seatInfo) return err(new SeatNotFoundError('Seat not found'));
    const { room, seat } = seatInfo;

    const simpleTextOrError = SimpleText.create({
      value: `${room.number.value}열람실 ${
        seat.number.value
      }번 좌석을 선택해 입실 하였습니다.\n${foundMyTicket.displayExpiry()}`,
    });
    if (simpleTextOrError.isErr()) return err(simpleTextOrError.error);

    return ok(simpleTextOrError.value);
  }
}
