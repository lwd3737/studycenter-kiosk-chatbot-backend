import { DomainError, Result, err, ok } from 'src/core';
import { CreateTicketProps, Ticket, TicketProps } from '../ticket/ticket.ar';
import { TicketUsageDurationUnit } from '../ticket/usage-duration.vo';

type SameDayTicketProps = TicketProps;
export type CreateSameDayTicketProps = Pick<
  CreateTicketProps,
  'title' | 'price'
> & {
  usageTime: number;
};
export type CreateNewSameDayTicketProps = Pick<
  CreateTicketProps,
  'title' | 'price'
> & {
  usageDuration: number;
};
export type CreateFromExsitingSameDayTicketProps = CreateTicketProps;
export type SameDayTicketType = typeof SAME_DAY_TICKET_TYPE;
export const SAME_DAY_TICKET_TYPE = 'SAME_DAY';

export class SameDayTicket extends Ticket<SameDayTicketProps> {
  public static new(
    props: CreateNewSameDayTicketProps,
  ): Result<SameDayTicket, DomainError> {
    return this.create({
      ...props,
      type: SAME_DAY_TICKET_TYPE,
      fixedSeat: true,
      usageDuration: {
        unit: TicketUsageDurationUnit.HOURS,
        value: props.usageDuration,
      },
    });
  }

  public static from(
    props: CreateFromExsitingSameDayTicketProps,
    id: string,
  ): Result<SameDayTicket, DomainError> {
    return this.create(props, id);
  }

  protected static create(
    props: CreateTicketProps,
    id?: string,
  ): Result<SameDayTicket, DomainError> {
    const propsOrError = this.createProps({
      ...props,
      type: SAME_DAY_TICKET_TYPE,
      fixedSeat: true,
    });
    if (propsOrError.isErr()) return err(propsOrError.error);

    return ok(new SameDayTicket(propsOrError.value, id));
  }

  private constructor(props: SameDayTicketProps, id?: string) {
    super(props, id);
  }

  get typeDisplay(): string {
    return '당일권';
  }

  get fullTitle(): string {
    return `(당일권)${this.title}`;
  }
}
