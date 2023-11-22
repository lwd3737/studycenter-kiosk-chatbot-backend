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
import {
  CreateFromExistingUsageDurationProps,
  CreateNewUsageDurationProps,
  UsageDurationFactory,
} from './usage-duration/usage-duration.factory';
import { SeatId } from 'src/modules/seat-management/domain/seat/seat-id';

type MyTicketProps = {
  paymentId: PaymentId;
  memberId: MemberId;
  ticketId: TicketId;
  title: string;
  inUse: boolean;
  usageDuration: MyTicketUsageDuration;
  seatIdInUse: SeatId | null;
};
type CreateNewMyTicketProps = Pick<MyTicketProps, 'title'> & {
  paymentId: string;
  memberId: string;
  type: TicketType;
  ticketId: string;
  totalUsageDuration: CreateNewUsageDurationProps['totalUsageDuration'];
};
type CreateFromExistingMyTicketProps = {
  paymentId: string;
  memberId: string;
  ticketId: string;
  title: string;
  inUse: boolean;
  usageDuration: CreateFromExistingUsageDurationProps;
  seatIdInUse: string | null;
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
        seatIdInUse: null,
      }),
    );
  }

  public static from(
    props: CreateFromExistingMyTicketProps,
    id: string,
  ): Result<MyTicket, DomainError> {
    const usageDurationOrError = UsageDurationFactory.from(props.usageDuration);
    if (usageDurationOrError.isErr())
      return err(new DomainError(usageDurationOrError.error.message));

    return ok(
      new MyTicket(
        {
          ...props,
          paymentId: new PaymentId(props.paymentId),
          memberId: new MemberId(props.memberId),
          ticketId: new TicketId(props.ticketId),
          usageDuration: usageDurationOrError.value,
          seatIdInUse: props.seatIdInUse ? new SeatId(props.seatIdInUse) : null,
        },
        id,
      ),
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

  get title(): string {
    return this.props.title;
  }

  get inUse(): boolean {
    return this.props.inUse;
  }

  get usageDuration(): MyTicketUsageDuration {
    return this.props.usageDuration;
  }

  get seatIdInUse(): SeatId | null {
    return this.props.seatIdInUse;
  }

  public displayExpiry(): string {
    return this.props.usageDuration.displayExpiry();
  }

  public startUsage(
    seatId: string,
    after: OnStartTicketUsage,
  ): Result<null, DomainError> {
    this.props.inUse = true;

    const updatedOrError = this.props.usageDuration.startUsage(after);
    if (updatedOrError.isErr()) return err(updatedOrError.error);
    const updated = updatedOrError.value;

    this.props.usageDuration = updated;
    this.props.seatIdInUse = new SeatId(seatId);

    return ok(null);
  }

  public stopUsage(): Result<{ usageDuration: number }, DomainError> {
    this.props.inUse = false;
    const stoppedOrError = this.props.usageDuration.stopUsage();
    if (stoppedOrError.isErr()) return err(stoppedOrError.error);

    const stopped = stoppedOrError.value;
    this.props.usageDuration = stopped.updated;

    return ok({ usageDuration: stopped.usageDuration });
  }
}
