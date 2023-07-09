import { ValueObject } from 'src/core';
import { TicketTime } from './time.value-object';

export type TicketExpirationTypeProps = { value: ExpirationTypeCategory };
export type ExpirationTypeCategory = ExpirationTypes[keyof ExpirationTypes];
export type ExpirationTypes = typeof EXPIRATION_TYPES;
export const EXPIRATION_TYPES = {
  duration: 'duration',
  dueDate: 'dueDate',
} as const;

export class TicketExpirationType extends ValueObject<TicketExpirationTypeProps> {
  get value(): ExpirationTypeCategory {
    return this.props.value;
  }

  public static calcDueDate(startDate: Date, ticketTime: TicketTime): Date {
    const dueDate = new Date(startDate.getTime());
    if (ticketTime.unit === 'days')
      dueDate.setDate(startDate.getDate() + ticketTime.value);
    else if (ticketTime.unit === 'hours')
      dueDate.setHours(startDate.getHours() + ticketTime.value);
    return dueDate;
  }

  // public static calcDuration(timeInfo: {
  //   startDate: Date;
  //   ticketTime: TicketTime;
  // }): Result<Date, DomainError> {
  //   if (timeInfo.ticketTime.unit === 'days')
  //     return err(
  //       new DomainError(
  //         'Ticket time unit is only allowed hours when expiration type is duration',
  //       ),
  //     );

  // }

  public static create(props: TicketExpirationTypeProps): TicketExpirationType {
    return new TicketExpirationType(props);
  }

  private constructor(props: TicketExpirationTypeProps) {
    super(props);
  }
}
