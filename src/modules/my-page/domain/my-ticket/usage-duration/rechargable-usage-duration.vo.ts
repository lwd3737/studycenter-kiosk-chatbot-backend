import { DomainError, Result, err, ok } from 'src/core';
import {
  CreateTotalDurationProps,
  MyTicketUsageDuration,
  MyTicketUsageDurationProps,
  ONE_HOUR,
  OnStartTicketUsage,
  StopUsageResult,
} from './usage-duration.vo';

type RechargableUsageDurationProps = MyTicketUsageDurationProps & {
  remainingTime: number | null;
};
type CreateNewRecharableUsageDurationProps = {
  totalDuration: {
    unit: string;
    value: number;
  };
};
type CreateFromExistingRechargableUsageDurationProps = Pick<
  RechargableUsageDurationProps,
  'startAt' | 'type' | 'remainingTime'
> & {
  totalDuration: CreateTotalDurationProps;
};
export type RechargableUsageDurationType =
  typeof RECHARGABLE_USAGE_DURATION_TYPE;
export const RECHARGABLE_USAGE_DURATION_TYPE = 'RECHARGABLE';

const ONE_MINUTE = 60 * 1000;
export class RechargableUsageDuration extends MyTicketUsageDuration<RechargableUsageDurationProps> {
  public static new(
    props: CreateNewRecharableUsageDurationProps,
  ): Result<RechargableUsageDuration, DomainError> {
    const totalDurationOrError = this.createTotalDurationProps(
      props.totalDuration,
    );
    if (totalDurationOrError.isErr()) return err(totalDurationOrError.error);

    return ok(
      new RechargableUsageDuration({
        type: RECHARGABLE_USAGE_DURATION_TYPE,
        startAt: null,
        remainingTime: null,
        totalDuration: totalDurationOrError.value,
      }),
    );
  }

  public static from(
    props: CreateFromExistingRechargableUsageDurationProps,
  ): Result<RechargableUsageDuration, DomainError> {
    const totalDurationOrError = this.createTotalDurationProps(
      props.totalDuration,
    );
    if (totalDurationOrError.isErr()) return err(totalDurationOrError.error);

    return ok(
      new RechargableUsageDuration({
        ...props,
        totalDuration: totalDurationOrError.value,
      }),
    );
  }

  get isExpired(): boolean {
    return this.isStarted && this.remainingTime === 0;
  }

  get remainingTime(): number {
    return this.props.remainingTime ?? this.totalDurationToMs();
  }

  public displayExpiry(): string {
    const hours = Math.floor(this.remainingTime / ONE_HOUR);
    const minutes = Math.floor((this.remainingTime % ONE_HOUR) / ONE_MINUTE);
    return `${hours}시간 ${minutes}분 뒤에 이용권이 만료됩니다.`;
  }

  public startUsage(
    after: OnStartTicketUsage,
  ): Result<RechargableUsageDuration, DomainError> {
    if (this.isStarted) return ok(this);

    const updatedOrError = RechargableUsageDuration.from({
      ...this.props,
      startAt: new Date(),
      remainingTime: this.totalDurationToMs(),
    });
    if (updatedOrError.isErr()) return err(updatedOrError.error);
    const updated = updatedOrError.value;

    updated.onStartUsage(after);

    return ok(updated);
  }

  public stopUsage(): StopUsageResult {
    const stopOrError = super.stopUsage();
    if (stopOrError.isErr()) return err(stopOrError.error);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const usedTime = Date.now() - this.startAt!.getTime();
    const updatedOrError = RechargableUsageDuration.from({
      ...this.props,
      remainingTime: Math.min(0, this.remainingTime - usedTime),
    });
    if (updatedOrError.isErr()) return err(updatedOrError.error);

    return ok({
      updated: updatedOrError.value,
      usageDuration: stopOrError.value.usageDuration,
    });
  }
}
