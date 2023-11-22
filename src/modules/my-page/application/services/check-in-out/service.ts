import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EventApiService } from 'src/modules/kakao-chatbot';
import { MyTicket } from '../../../domain/my-ticket/my-ticket.ar';
import { AppError, DomainError, Result, UnknownError, err, ok } from 'src/core';
import { MyTicketService } from '../my-ticket.service';
import { SeatService } from 'src/modules/seat-management/services/seat.service';
import { NoCheckInError } from './error';

const ERROR_TYPE = 'CheckInOutServiceError';
const NOTIFICATION_TIME = 1000 * 60 * 10; // 10분

@Injectable()
export class CheckInOutService {
  constructor(
    @Inject(forwardRef(() => EventApiService))
    private eventApiService: EventApiService,
    private myTicketService: MyTicketService,
    private seatService: SeatService,
  ) {}

  public async checkIn(
    myTicket: MyTicket,
    appUserId: string,
    seatId: string,
  ): Promise<Result<true, DomainError>> {
    const startedOrError = myTicket.startUsage(seatId, {
      onBeforeExpire: {
        handler: () => this.onNotifyBeforeExpire(appUserId),
        time: NOTIFICATION_TIME,
      },
      onExpire: () => this.onExpired(appUserId),
    });
    if (startedOrError.isErr()) return err(startedOrError.error);

    // TODO: 실패 시 롤백
    const assignedOrError = await this.seatService.assignSeatToMember(
      myTicket.memberId.value,
      seatId,
    );
    if (assignedOrError.isErr()) return err(assignedOrError.error);

    try {
      await this.myTicketService.update(myTicket);
    } catch (error) {
      return err(error);
    }

    return ok(true);
  }

  private async onNotifyBeforeExpire(appUserId: string) {
    const res = await this.eventApiService.publish({
      event: {
        name: 'notifyBeforeExpire',
        data: {
          remainingTime: `${NOTIFICATION_TIME / (60 * 1000)}분`,
        },
      },
      user: {
        type: 'appUserId',
        id: appUserId,
      },
    });
    if (res.status !== 'SUCCESS') {
      console.error(
        `[CheckInOutService]: Failed to notify before expired: ${res.message}`,
      );
    }
  }

  private async onExpired(appUserId: string) {
    const res = await this.eventApiService.publish({
      event: {
        name: 'ticketExpired',
      },
      user: {
        type: 'appUserId',
        id: appUserId,
      },
    });
    if (res.status !== 'SUCCESS') {
      console.error(
        `[CheckInOutService]: Failed to notify when expired: ${res.message}`,
      );
    }
  }

  public async checkOut(): Promise<
    Result<{ usageDuration: number }, DomainError | NoCheckInError>
  > {
    // 좌석 반환, 시간권 이용시간 차감, 오늘 이용시간 표시
    const foundMyTicket = await this.myTicketService.findOneInUse();
    console.log('found', foundMyTicket);
    if (!foundMyTicket)
      return err(new NoCheckInError('No ticket in use found'));
    if (!foundMyTicket.seatIdInUse)
      return err(new NoCheckInError(`Seat id in use is null`));

    const foundSeat = await this.seatService.findSeatInfoById(
      foundMyTicket.seatIdInUse,
    );
    if (!foundSeat) return err(new AppError(`[${ERROR_TYPE}]Seat not found`));

    const stoppedOrError = foundMyTicket.stopUsage();
    if (stoppedOrError.isErr()) return err(stoppedOrError.error);

    try {
      await this.myTicketService.update(foundMyTicket);
      await this.seatService.unassignSeatFromMember(
        foundMyTicket.seatIdInUse.value,
      );

      return ok({
        usageDuration: stoppedOrError.value.usageDuration,
      });
    } catch (error) {
      return err(new UnknownError(error));
    }
  }
}
