import { DomainError, Result, err, ok } from 'src/core';
import {
  HOURS_RECHARGE_TICKET_TYPE,
  PERIOD_TICKET_TYPE,
  SAME_DAY_TICKET_TYPE,
  TicketType,
} from 'src/modules/ticketing';
import {
  RECHARGABLE_USAGE_DURATION_TYPE,
  RechargableUsageDuration,
} from './rechargable-usage-duration.vo';
import {
  FIXED_EXPIRY_USAGE_DURATION_TYPE,
  FixedExpiryUsageDuration,
} from './fixed-expiry-usage-duration.vo';

export type UsageDurationType =
  | RechargableUsageDuration
  | FixedExpiryUsageDuration;

export class UsageDurationFactory {
  public static new(
    ticketType: TicketType,
    props: {
      totalUsageDuration: {
        unit: string;
        value: number;
      };
    },
  ): Result<UsageDurationType, DomainError> {
    switch (ticketType) {
      case HOURS_RECHARGE_TICKET_TYPE: {
        const usageDurationOrError = RechargableUsageDuration.new({
          totalDuration: props.totalUsageDuration,
        });
        if (usageDurationOrError.isErr())
          return err(usageDurationOrError.error);
        return ok(usageDurationOrError.value);
      }
      case PERIOD_TICKET_TYPE:
      case SAME_DAY_TICKET_TYPE: {
        const usageDurationOrError = FixedExpiryUsageDuration.new({
          totalUsageDuration: props.totalUsageDuration,
        });
        if (usageDurationOrError.isErr())
          return err(usageDurationOrError.error);
        return ok(usageDurationOrError.value);
      }
      default:
        return err(
          new DomainError('[UsageDurationFactory]: invalid ticket type'),
        );
    }
  }

  public static from(props: {
    type: string;
    totalDuration: {
      unit: string;
      value: number;
    };
    startAt: Date | null;
    endAt?: Date | null;
    remainingTime?: number;
  }): Result<UsageDurationType, DomainError> {
    switch (props.type) {
      case FIXED_EXPIRY_USAGE_DURATION_TYPE:
        if (props.endAt === undefined)
          return err(
            new DomainError(
              `[UsageDurationFactory]: usage duration endAt is undefined when type is ${FIXED_EXPIRY_USAGE_DURATION_TYPE}`,
            ),
          );
        return FixedExpiryUsageDuration.from({
          ...props,
          endAt: props.endAt as Date | null,
        });
      case RECHARGABLE_USAGE_DURATION_TYPE:
        if (props.remainingTime === undefined)
          return err(
            new DomainError(
              `[UsageDurationFactory]: usage duration remainingTime is undefined when type is ${RECHARGABLE_USAGE_DURATION_TYPE}`,
            ),
          );
        return RechargableUsageDuration.from({
          ...props,
          remainingTime: props.remainingTime as number | null,
        });
      default:
        return err(
          new DomainError(
            '[UsageDurationFactory]: invalid usage duration type',
          ),
        );
    }
  }
}
