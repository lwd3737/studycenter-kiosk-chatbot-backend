import { DomainError, Result } from 'src/core';
import {
  CreateTicketProps,
  Ticket,
  TicketProps,
} from '../ticket/ticket.aggregate-root';
import {
  TICKET_TIME_UNITS,
  TicketTimeProps,
} from '../ticket/time.value-object';
import { EXPIRATION_TYPES } from '../ticket/expiration-type.value-object';
import { PeriodTicketType } from './type.value-object';

type PeriodTicketProps = TicketProps<PeriodTicketType>;
export type CreatePeriodTicketProps = Pick<
  CreateTicketProps<PeriodTicketType>,
  'title' | 'price'
> & {
  time: Pick<TicketTimeProps, 'value'>;
};

export class PeriodTicket extends Ticket<PeriodTicketType, PeriodTicketProps> {
  public static new(props: CreatePeriodTicketProps) {
    return this.create(props);
  }

  public static from(props: CreatePeriodTicketProps, id: string) {
    return this.create(props, id);
  }

  protected static create(
    props: CreatePeriodTicketProps,
    id?: string,
  ): Result<PeriodTicket, DomainError> {
    return super.create(
      {
        ...props,
        type: PeriodTicketType.create(),
        time: {
          unit: TICKET_TIME_UNITS.days,
          value: props.time.value,
        },
        isFixedSeat: true,
        expirationType: {
          value: EXPIRATION_TYPES.dueDate,
        },
      },
      id,
    );
  }

  private constructor(props: PeriodTicketProps) {
    super(props);
  }
}
