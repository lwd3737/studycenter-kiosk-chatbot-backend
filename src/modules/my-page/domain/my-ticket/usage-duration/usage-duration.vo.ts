import { DomainError, Result, ValueObject, err, ok } from 'src/core';

export interface MyTicketUsageDurationProps {
  type: string;
  totalDuration: TotalUsageDuration;
  startAt: Date | null;
}
export type TotalUsageDuration = {
  unit: TotalUsageDurationUnit;
  value: number;
};
export enum TotalUsageDurationUnit {
  DAYS = 'DAYS',
  HOURS = 'HOURS',
}
export type CreateTotalDurationProps = {
  unit: string;
  value: number;
};
export type OnStartTicketUsage = {
  onBeforeExpire: {
    handler: UsageDurationHandler;
    time: number;
  };
  onExpire: UsageDurationHandler;
};
export type UsageDurationHandler = () => void;

export abstract class MyTicketUsageDuration<
  P extends MyTicketUsageDurationProps = MyTicketUsageDurationProps,
> extends ValueObject<P> {
  private static HOUR = 60 * 60 * 1000;
  private static DAY = 24 * MyTicketUsageDuration.HOUR;

  private expireTimer: null | NodeJS.Timeout;
  private beforeExpire: {
    time: number | null;
    timer: null | NodeJS.Timeout;
  } = { time: null, timer: null };

  public static createTotalDurationProps(
    props: CreateTotalDurationProps,
  ): Result<TotalUsageDuration, DomainError> {
    const isUnitValid = Object.values(TotalUsageDurationUnit).includes(
      props.unit as any,
    );
    if (!isUnitValid)
      return err(new DomainError('[MyTicketUsageDuration]: Invalid unit'));

    return ok({
      unit: TotalUsageDurationUnit[props.unit as TotalUsageDurationUnit],
      value: props.value,
    });
  }

  abstract get isExpired(): boolean;

  abstract get remainingTime(): number;

  get type(): string {
    return this.props.type;
  }

  get startAt(): Date | null {
    return this.props.startAt;
  }

  get totalDuration(): TotalUsageDuration {
    return this.props.totalDuration;
  }

  get isStarted(): boolean {
    return this.startAt !== null;
  }

  protected totalDurationToMs(): number {
    switch (this.props.totalDuration.unit) {
      case TotalUsageDurationUnit.DAYS:
        return this.props.totalDuration.value * MyTicketUsageDuration.DAY;
      case TotalUsageDurationUnit.HOURS:
        return this.props.totalDuration.value * MyTicketUsageDuration.HOUR;
    }
  }

  public test__onStartUsage(after: OnStartTicketUsage): void {
    if (this.isExpired) return;

    this.beforeExpire.timer = setTimeout(
      () => after.onBeforeExpire.handler(),
      5000,
    );
    this.expireTimer = setTimeout(() => {
      after.onExpire();
      this.stopUsage();
    }, 10000);
  }

  abstract startUsage(
    after: OnStartTicketUsage,
  ): Result<MyTicketUsageDuration, DomainError>;

  public onStartUsage(after: OnStartTicketUsage): void {
    if (this.isExpired) return;
    if (this.isStarted) return;

    this.beforeExpire.timer = setTimeout(
      () => after.onBeforeExpire.handler(),
      this.remainingTime - after.onBeforeExpire.time,
    );
    this.expireTimer = setTimeout(() => {
      after.onExpire();
      this.stopUsage();
    }, this.remainingTime);
  }

  public stopUsage(): Result<MyTicketUsageDuration | null, DomainError> {
    if (this.expireTimer) clearTimeout(this.expireTimer);
    return ok(null);
  }
}