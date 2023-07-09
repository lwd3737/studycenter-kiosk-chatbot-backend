import { DomainError, Result } from 'src/core';
import { EXPIRATION_TYPES } from '../ticket/expiration-type.value-object';
import {
  CreateTicketProps,
  Ticket,
  TicketProps,
} from '../ticket/ticket.aggregate-root';
import {
  TICKET_TIME_UNITS,
  TicketTimeProps,
} from '../ticket/time.value-object';
import { HoursRechargeTicketType } from './type.value-object';

type HoursRechargeTicketProps = TicketProps<HoursRechargeTicketType>;
export type CreateHoursRechargeTicketProps = Pick<
  CreateTicketProps<HoursRechargeTicketType>,
  'title' | 'price'
> & {
  time: Pick<TicketTimeProps, 'value'>;
};

export class HoursRechargeTicket extends Ticket<
  HoursRechargeTicketType,
  HoursRechargeTicketProps
> {
  public static new(props: CreateHoursRechargeTicketProps) {
    return this.create(props);
  }

  public static from(props: CreateHoursRechargeTicketProps, id: string) {
    return this.create(props, id);
  }

  protected static create(
    props: CreateHoursRechargeTicketProps,
    id?: string,
  ): Result<HoursRechargeTicket, DomainError> {
    return super.create(
      {
        ...props,
        type: HoursRechargeTicketType.create(),
        time: {
          unit: TICKET_TIME_UNITS.hours,
          value: props.time.value,
        },
        isFixedSeat: false,
        expirationType: {
          value: EXPIRATION_TYPES.duration,
        },
      },
      id,
    );
  }

  private constructor(props: HoursRechargeTicketProps) {
    super(props);
  }
}
