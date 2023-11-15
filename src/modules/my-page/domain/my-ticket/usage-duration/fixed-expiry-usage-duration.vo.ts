import { DomainError, Result, err, ok } from 'src/core';
import {
  CreateTotalDurationProps,
  MyTicketUsageDuration,
  MyTicketUsageDurationProps,
  OnStartTicketUsage,
} from './usage-duration.vo';

type FixedExpiryUsageDurationProps = MyTicketUsageDurationProps & {
  endAt: Date | null;
};
type CreateNewFixedExpiryUsageDurationProps = {
  totalUsageDuration: CreateTotalDurationProps;
};
type CreateFromExistingFixedExpiryUsageDurationProps = Pick<
  FixedExpiryUsageDurationProps,
  'startAt' | 'type' | 'endAt'
> & {
  totalDuration: CreateTotalDurationProps;
};
export type FixedExpiryUsageDurationType =
  typeof FIXED_EXPIRY_USAGE_DURATION_TYPE;
export const FIXED_EXPIRY_USAGE_DURATION_TYPE = 'FIXED_EXPIRY';

export class FixedExpiryUsageDuration extends MyTicketUsageDuration<FixedExpiryUsageDurationProps> {
  public static new(
    props: CreateNewFixedExpiryUsageDurationProps,
  ): Result<FixedExpiryUsageDuration, DomainError> {
    const totalDurationOrError = this.createTotalDurationProps(
      props.totalUsageDuration,
    );
    if (totalDurationOrError.isErr()) return err(totalDurationOrError.error);

    return ok(
      new FixedExpiryUsageDuration({
        type: FIXED_EXPIRY_USAGE_DURATION_TYPE,
        startAt: null,
        endAt: null,
        totalDuration: totalDurationOrError.value,
      }),
    );
  }

  public static from(
    props: CreateFromExistingFixedExpiryUsageDurationProps,
  ): Result<FixedExpiryUsageDuration, DomainError> {
    const totalDurationOrError = this.createTotalDurationProps(
      props.totalDuration,
    );
    if (totalDurationOrError.isErr()) return err(totalDurationOrError.error);

    return ok(
      new FixedExpiryUsageDuration({
        ...props,
        totalDuration: totalDurationOrError.value,
      }),
    );
  }

  private constructor(props: FixedExpiryUsageDurationProps) {
    super(props);
  }

  get endAt(): Date | null {
    return this.props.endAt;
  }

  get isExpired(): boolean {
    if (this.endAt === null) return false;
    return this.endAt.getTime() < Date.now();
  }

  get remainingTime(): number {
    if (this.endAt === null) return this.totalDurationToMs();
    return Math.min(0, this.endAt.getTime() - Date.now());
  }

  public displayExpiry(): string {
    if (this.endAt === null) return '';
    return `${this.endAt.getFullYear()}/${
      this.endAt.getMonth() + 1
    }/${this.endAt.getDate()} ${this.endAt.getHours()}시 ${this.endAt.getMinutes()}분에 이용권이 만료됩니다.`;
  }

  public startUsage(
    after: OnStartTicketUsage,
  ): Result<FixedExpiryUsageDuration, DomainError> {
    if (this.isStarted) return ok(this);

    const updatedOrError = FixedExpiryUsageDuration.from({
      ...this.props,
      startAt: new Date(),
      endAt: new Date(Date.now() + this.totalDurationToMs()),
    });
    if (updatedOrError.isErr()) return err(updatedOrError.error);
    const updated = updatedOrError.value;

    updated.onStartUsage(after);

    return ok(updated);
  }
}
