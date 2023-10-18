import { MyTicket } from 'src/modules/my-page/domain/my-ticket/my-ticket.ar';
import { MockMyTicketSchema } from '../../repos/mock/mock-my-ticket.repo';
import {
  RECHARGABLE_USAGE_DURATION_TYPE,
  RechargableUsageDuration,
  RechargableUsageDurationType,
} from 'src/modules/my-page/domain/my-ticket/usage-duration/rechargable-usage-duration.vo';
import {
  FIXED_EXPIRY_USAGE_DURATION_TYPE,
  FixedExpiryUsageDuration,
  FixedExpiryUsageDurationType,
} from 'src/modules/my-page/domain/my-ticket/usage-duration/fixed-expiry-usage-duration.vo';

export class MockMyTicketMapper {
  static toPersistence(domain: MyTicket): MockMyTicketSchema {
    const { usageDuration } = domain;

    return {
      paymentId: domain.paymentId.value,
      memberId: domain.memberId.value,
      ticketId: domain.ticketId.value,
      inUse: domain.inUse,
      usageDuration: {
        type: usageDuration.type as
          | FixedExpiryUsageDurationType
          | RechargableUsageDurationType,
        totalDuration: {
          unit: usageDuration.totalDuration.unit,
          value: usageDuration.totalDuration.value,
        },
        startAt: usageDuration.startAt,
        endAt:
          usageDuration.type === FIXED_EXPIRY_USAGE_DURATION_TYPE
            ? (usageDuration as FixedExpiryUsageDuration).endAt
            : undefined,
        remainingTime:
          usageDuration.type === RECHARGABLE_USAGE_DURATION_TYPE
            ? (usageDuration as RechargableUsageDuration).remainingTime
            : undefined,
      },
    };
  }

  static toDomain(raw: MockMyTicketSchema): MyTicket {
    const { usageDuration } = raw;

    const myTicketOrError = MyTicket.from({
      paymentId: raw.paymentId,
      memberId: raw.memberId,
      ticketId: raw.ticketId,
      inUse: raw.inUse,
      usageDuration: {
        type: usageDuration.type,
        totalDuration: {
          unit: usageDuration.totalDuration.unit,
          value: usageDuration.totalDuration.value,
        },
        startAt: usageDuration.startAt,
        endAt:
          usageDuration.type === FIXED_EXPIRY_USAGE_DURATION_TYPE
            ? usageDuration.endAt
            : undefined,
        remainingTime:
          usageDuration.type === RECHARGABLE_USAGE_DURATION_TYPE
            ? usageDuration.remainingTime
            : undefined,
      },
    });
    if (myTicketOrError.isErr()) throw myTicketOrError.error;

    return myTicketOrError.value;
  }
}
