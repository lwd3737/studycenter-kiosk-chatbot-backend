import { AggregateRoot, DomainError, Result, err, ok } from 'src/core';
import { TicketId, TicketType } from 'src/modules/ticketing';
import { FixedExpiryUsageDurationType } from './usage-duration/fixed-expiry-usage-duration.vo';
import { RechargableUsageDurationType } from './usage-duration/rechargable-usage-duration.vo';
import {
  MyTicketUsageDuration,
  OnStartTicketUsage,
} from './usage-duration/usage-duration.vo';
import { PaymentId } from 'src/modules/payment';
import { MemberId } from 'src/modules/member/domain/member/member-id';
import { UsageDurationFactory } from './usage-duration/usage-duration.factory';

type MyTicketProps = {
  paymentId: PaymentId;
  memberId: MemberId;
  ticketId: TicketId;
  inUse: boolean;
  usageDuration: MyTicketUsageDuration;
};
type CreateNewMyTicketProps = {
  paymentId: string;
  memberId: string;
  ticketId: string;
  type: TicketType;
  totalUsageDuration: {
    unit: string;
    value: number;
  };
};
type CreateFromExistingMyTicketProps = {
  paymentId: string;
  memberId: string;
  ticketId: string;
  inUse: boolean;
  usageDuration: CreateFromExistingUsageDurationProps;
};
type CreateFromExistingUsageDurationProps = {
  type: string;
  totalDuration: {
    unit: string;
    value: number;
  };
  startAt: Date | null;
  endAt?: Date | null;
  remainingTime?: number;
};
export type UsageDurationType =
  | FixedExpiryUsageDurationType
  | RechargableUsageDurationType;

export class MyTicket extends AggregateRoot<MyTicketProps> {
  public static new(
    props: CreateNewMyTicketProps,
  ): Result<MyTicket, DomainError> {
    const usageDurationOrError = UsageDurationFactory.new(props.type, {
      totalUsageDuration: props.totalUsageDuration,
    });
    if (usageDurationOrError.isErr()) return err(usageDurationOrError.error);
    return ok(
      new MyTicket({
        ...props,
        paymentId: new PaymentId(props.paymentId),
        memberId: new MemberId(props.memberId),
        ticketId: new TicketId(props.ticketId),
        inUse: false,
        usageDuration: usageDurationOrError.value,
      }),
    );
  }

  public static from(
    props: CreateFromExistingMyTicketProps,
  ): Result<MyTicket, DomainError> {
    const usageDurationOrError = UsageDurationFactory.from(props.usageDuration);
    if (usageDurationOrError.isErr())
      return err(new DomainError(usageDurationOrError.error.message));

    return ok(
      new MyTicket({
        ...props,
        paymentId: new PaymentId(props.paymentId),
        memberId: new MemberId(props.memberId),
        ticketId: new TicketId(props.ticketId),
        usageDuration: usageDurationOrError.value,
      }),
    );
  }

  private constructor(props: MyTicketProps, id?: string) {
    super(props, id);
  }

  get paymentId(): PaymentId {
    return this.props.paymentId;
  }

  get memberId(): MemberId {
    return this.props.memberId;
  }

  get ticketId(): TicketId {
    return this.props.ticketId;
  }

  get inUse(): boolean {
    return this.props.inUse;
  }

  get usageDuration(): MyTicketUsageDuration {
    return this.props.usageDuration;
  }

  public startUsage(after: OnStartTicketUsage): Result<null, DomainError> {
    this.props.inUse = true;

    const updatedOrError = this.props.usageDuration.startUsage(after);
    if (updatedOrError.isErr()) return err(updatedOrError.error);
    const updated = updatedOrError.value;

    this.props.usageDuration = updated;

    return ok(null);
  }

  public stopUsage(): Result<MyTicketUsageDuration | null, DomainError> {
    this.props.inUse = false;
    const updatedOrError = this.props.usageDuration.stopUsage();
    if (updatedOrError.isErr()) return err(updatedOrError.error);

    const updated = updatedOrError.value;
    if (updated) this.props.usageDuration = updated;

    return ok(updated);
  }
}
