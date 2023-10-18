import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EventApiService } from 'src/modules/kakao-chatbot';
import { MyTicket } from '../../domain/my-ticket/my-ticket.ar';
import { Member } from 'src/modules/member';
import { DomainError, Result, err, ok } from 'src/core';

const NOTIFICATION_TIME = 1000 * 60 * 10; // 10분

@Injectable()
export class CheckInOutService {
  constructor(
    @Inject(forwardRef(() => EventApiService))
    private eventApiService: EventApiService,
  ) {}

  public checkIn(
    myTicket: MyTicket,
    member: Member,
  ): Result<null, DomainError> {
    const okOrError = myTicket.startUsage({
      onBeforeExpire: {
        handler: () => this.onNotifyBeforeExpire(member.appUserId),
        time: NOTIFICATION_TIME,
      },
      onExpire: () => this.onExpired(member.appUserId),
    });
    if (okOrError.isErr()) return err(okOrError.error);

    return ok(okOrError.value);
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
}
