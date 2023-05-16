import { AggregateRoot } from 'src/core';
import { PaymentId } from 'src/modules/payment';
import { Ticket, TicketId } from 'src/modules/ticketing';
import { TicketCategoryEnum } from 'src/modules/ticketing/domain/ticket/ticket-category.value-object';

interface Props {
  paymentId: PaymentId;
  ticketId: TicketId;
  startTime: Date;
  endTime?: Date;
  remainginMinutes?: number;
}

type CreateProps = {
  paymentId: PaymentId;
  ticket: Ticket;
};

export class TicketUsage extends AggregateRoot<Props> {
  public static create(props: CreateProps) {
    const _props = {
      paymentId: props.paymentId,
      ticketId: props.ticket.id,
      startTime: new Date(),
    };

    switch (props.ticket.category.value) {
      case TicketCategoryEnum.PERIOD:
      case TicketCategoryEnum.SAME_DAY:
      case TicketCategoryEnum.HOURS_RECHARGE:
    }

    return new TicketUsage({
      ..._props,
    });
  }

  private constructor(props: Props) {
    super(props);
  }
}
