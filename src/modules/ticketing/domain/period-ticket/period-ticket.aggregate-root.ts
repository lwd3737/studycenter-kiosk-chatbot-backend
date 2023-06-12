import { Result, combine, err, ok } from 'src/core';
import {
  CreateNewTicketProps,
  Ticket,
  TicketProps,
} from '../ticket/ticket.aggregate-root';
import { TicketTime } from '../ticket/time.value-object';
import { TicketPrice } from '../ticket/price.value-object';
import {
  DUE_DATE_TYPE,
  TicketExpiration,
} from '../ticket/expiration.value-object';
import { TicketError } from '../ticket/ticket.error';
import { PeriodTicketType } from './type.value-object';

type Props = TicketProps<PeriodTicketType>;

export type CreateNewPeriodTicketProps = CreateNewTicketProps;

export class PeriodTicket extends Ticket<PeriodTicketType, Props> {
  public static createNew(
    props: CreateNewPeriodTicketProps,
  ): Result<PeriodTicket, TicketError> {
    const propsOrError = combine(
      TicketTime.create(props.time),
      TicketPrice.create(props.price),
    );
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [time, price] = propsOrError.value;

    return ok(
      new PeriodTicket({
        ...props,
        type: PeriodTicketType.create(),
        isFixedSeat: true,
        time,
        price,
        expiration: TicketExpiration.create({
          type: DUE_DATE_TYPE,
        }),
      }),
    );
  }

  private constructor(props: Props) {
    super(props);
  }
}
