import { ValueObject } from 'src/core';
import { TicketTime } from './time.value-object';

type TicketExpirationProps =
  | {
      type: typeof DUE_DATE_TYPE;
    }
  | {
      type: typeof DURATION_TYPE;
    };
export const DURATION_TYPE = 'duration';
export const DUE_DATE_TYPE = 'duedate';
export type ExpirationType = typeof DURATION_TYPE | typeof DUE_DATE_TYPE;
export type CreateTicketExpirationProps = TicketExpirationProps;

export class TicketExpiration extends ValueObject<TicketExpirationProps> {
  get type(): ExpirationType {
    return this.props.type;
  }

  public static calDueDate(startDate: Date, ticketTime: TicketTime): Date {
    const dueDate = new Date(startDate.getTime());
    dueDate.setDate(startDate.getDate() + ticketTime.value);
    return dueDate;
  }

  public static create(props: CreateTicketExpirationProps): TicketExpiration {
    return new TicketExpiration(props);
  }

  private constructor(props: TicketExpirationProps) {
    super(props);
  }
}
