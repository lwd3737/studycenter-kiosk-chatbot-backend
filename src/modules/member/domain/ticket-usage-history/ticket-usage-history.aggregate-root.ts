import { AggregateRoot, DomainError, Result, err, ok } from 'src/core';
import { Ticket, TicketId } from 'src/modules/ticketing';
import { ValidTime } from './valid-time.value-object';
import { PaymentId } from 'src/modules/payment/domain/payment/base/payment-id';

interface Props {
  paymentId: PaymentId;
  ticketId: TicketId;
  inUse: boolean;
  startAt: Date;
  // endAt?: Date;
  // validTime?: ValidTime;
}

type CreateNewProps = {
  paymentId: PaymentId;
  ticket: Ticket;
};

export class TicketUsageHistory extends AggregateRoot<Props> {
  public static createNew(props: CreateNewProps) {
    const startDate = new Date();
    // const endDateOrValidTimeOrError = this.createEndAtOrValidTime({
    //   ticket: props.ticket,
    //   startDate: startDate,
    // });
    // if (endDateOrValidTimeOrError.isErr())
    //   return err(endDateOrValidTimeOrError.error);

    // return ok(
    //   new TicketUsage({
    //     paymentId: props.paymentId,
    //     ticketId: props.ticket.ticketId,
    //     startAt: startDate,
    //     ...endDateOrValidTimeOrError.value,
    //   }),
    // );
  }

  // private static createEndAtOrValidTime(props: {
  //   ticket: Ticket;
  //   startDate: Date;
  // }): Result<{ endTime: Date } | { validTime: ValidTime }, DomainError> {
  //   switch (props.ticket.type) {
  //     case TicketCategoryEnum.PERIOD: {
  //       const endDate = new Date();
  //       endDate.setDate(props.startDate.getDate() + props.ticket.time.value);
  //       return ok({ endTime: endDate });
  //     }
  //     case TicketCategoryEnum.SAME_DAY: {
  //       const endDate = new Date();
  //       endDate.setHours(props.startDate.getHours() + props.ticket.time.value);
  //       return ok({ endTime: endDate });
  //     }
  //     case TicketCategoryEnum.HOURS_RECHARGE: {
  //       const validTime = ValidTime.create({
  //         seconds: Date.now() + props.ticket.time.value * 60 * 60,
  //       });

  //       return ok({ validTime });
  //     }
  //     default:
  //       return err(
  //         new TicketUsageErrors.InvalidTicketCategory(
  //           props.ticket.category.value,
  //         ),
  //       );
  //   }
  // }

  private constructor(props: Props, id?: string) {
    super(props, id);
  }
}
