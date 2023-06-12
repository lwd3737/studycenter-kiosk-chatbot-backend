import { DomainError, Result, combine, err, ok } from 'src/core';
import { TicketPrice } from '../ticket/price.value-object';
import {
  CreateNewTicketProps,
  Ticket,
  TicketProps,
} from '../ticket/ticket.aggregate-root';
import {
  DUE_DATE_TYPE,
  TicketExpiration,
} from '../ticket/expiration.value-object';
import { TicketTime } from '../ticket/time.value-object';
import { SameDayTicketType } from './type.value-object';

type Props = TicketProps<SameDayTicketType>;
export type CreateNewSameDayProps = CreateNewTicketProps;

export class SameDayTicket extends Ticket<SameDayTicketType, Props> {
  static createNew(
    props: CreateNewSameDayProps,
  ): Result<SameDayTicket, DomainError> {
    const propsOrError = combine(
      TicketTime.create(props.time),
      TicketPrice.create(props.price),
    );
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [time, price] = propsOrError.value;

    return ok(
      new SameDayTicket({
        ...props,
        type: SameDayTicketType.create(),
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
