import { DomainError, Result, combine, err, ok } from 'src/core';
import {
  DURATION_TYPE,
  TicketExpiration,
} from '../ticket/expiration.value-object';
import {
  CreateNewTicketProps,
  Ticket,
  TicketProps,
} from '../ticket/ticket.aggregate-root';
import { TicketTime } from '../ticket/time.value-object';
import { TicketPrice } from '../ticket/price.value-object';
import { HoursRechargeTicketType } from './type.value-object';

type Props = TicketProps<HoursRechargeTicketType>;

export type CreateNewHoursRechargeTicketProps = CreateNewTicketProps;

export class HoursRechargeTicket extends Ticket<
  HoursRechargeTicketType,
  Props
> {
  public static createNew(
    props: CreateNewHoursRechargeTicketProps,
  ): Result<HoursRechargeTicket, DomainError> {
    const propsOrError = combine(
      TicketTime.create(props.time),
      TicketPrice.create(props.price),
    );
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [time, price] = propsOrError.value;

    return ok(
      new HoursRechargeTicket({
        ...props,
        type: HoursRechargeTicketType.create(),
        isFixedSeat: false,
        time,
        price,
        expiration: TicketExpiration.create({
          type: DURATION_TYPE,
        }),
      }),
    );
  }

  private constructor(props: Props) {
    super(props);
  }
}
