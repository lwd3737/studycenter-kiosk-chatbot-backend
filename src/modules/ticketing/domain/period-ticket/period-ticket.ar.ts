import { DomainError, Result, err, ok } from 'src/core';
import { CreateTicketProps, Ticket, TicketProps } from '../ticket/ticket.ar';
import { TicketUsageDurationUnit } from '../ticket/usage-duration.vo';

type PeriodTicketProps = TicketProps;
export type CreateNewPeriodTicketProps = Pick<
  CreateTicketProps,
  'title' | 'price'
> & {
  usageDuration: number;
};
export type CreateFromExistingPeriodTicketProps = CreateTicketProps;
export type PeriodTicketType = typeof PERIOD_TICKET_TYPE;
export const PERIOD_TICKET_TYPE = 'PERIOD';

export class PeriodTicket extends Ticket<PeriodTicketProps> {
  public static new(
    props: CreateNewPeriodTicketProps,
  ): Result<PeriodTicket, DomainError> {
    return this.create({
      ...props,
      type: PERIOD_TICKET_TYPE,
      fixedSeat: true,
      usageDuration: {
        unit: TicketUsageDurationUnit.DAYS,
        value: props.usageDuration,
      },
    });
  }

  public static from(props: CreateFromExistingPeriodTicketProps, id: string) {
    return this.create(props, id);
  }

  protected static create(
    props: CreateTicketProps,
    id?: string,
  ): Result<PeriodTicket, DomainError> {
    const propsOrError = this.createProps({
      ...props,
      fixedSeat: true,
    });
    if (propsOrError.isErr()) return err(propsOrError.error);

    return ok(new PeriodTicket(propsOrError.value, id));
  }

  private constructor(props: PeriodTicketProps, id?: string) {
    super(props, id);
  }

  get typeDisplay(): string {
    return '정기권';
  }

  get fullTitle(): string {
    return `(정기권)${this.title}`;
  }
}
