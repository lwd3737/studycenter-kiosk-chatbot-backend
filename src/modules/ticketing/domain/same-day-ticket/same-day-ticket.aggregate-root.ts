import { DomainError, Result } from 'src/core';
import {
  CreateTicketProps,
  Ticket,
  TicketProps,
} from '../ticket/ticket.aggregate-root';
import { EXPIRATION_TYPES } from '../ticket/expiration-type.value-object';
import {
  TICKET_TIME_UNITS,
  TicketTimeProps,
} from '../ticket/time.value-object';
import { SameDayTicketType } from './type.value-object';

type SameDayTicketProps = TicketProps<SameDayTicketType>;
export type CreateSameDayTicketProps = Pick<
  CreateTicketProps<SameDayTicketType>,
  'title' | 'price'
> & {
  time: Pick<TicketTimeProps, 'value'>;
};

export class SameDayTicket extends Ticket<
  SameDayTicketType,
  SameDayTicketProps
> {
  public static new(props: CreateSameDayTicketProps) {
    return this.create(props);
  }

  public static from(props: CreateSameDayTicketProps, id: string) {
    return this.create(props, id);
  }

  protected static create(
    props: CreateSameDayTicketProps,
    id?: string,
  ): Result<SameDayTicket, DomainError> {
    return super.create(
      {
        ...props,
        type: SameDayTicketType.create(),
        time: {
          unit: TICKET_TIME_UNITS.hours,
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

  private constructor(props: SameDayTicketProps) {
    super(props);
  }
}
