import { DomainError, Result, ValueObject, err, ok } from 'src/core';
import { TicketErrors } from './ticket.error';

interface TicketPriceProps {
  value: number;
}

export type CreateTicketPriceProps = TicketPriceProps;

export class TicketPrice extends ValueObject<TicketPriceProps> {
  get value(): number {
    return this.props.value;
  }

  public static create(
    props: CreateTicketPriceProps,
  ): Result<TicketPrice, DomainError> {
    if (this.isNotInteger(props))
      return err(new TicketErrors.PriceNotInteger());
    if (this.isNotPositive(props))
      return err(new TicketErrors.PriceNotPositive());

    return ok(new TicketPrice(props));
  }

  private static isNotInteger(props: CreateTicketPriceProps): boolean {
    return !Number.isInteger(props.value);
  }

  private static isNotPositive(props: CreateTicketPriceProps): boolean {
    return props.value < 0;
  }

  private constructor(props: TicketPriceProps) {
    super(props);
  }
}
