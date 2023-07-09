import { DomainError, Result, ValueObject, err, ok } from 'src/core';
import { PaymentErrors } from '../errors/payment.error';

interface Props {
  value: number;
}

export type CreateAmountProps = number;

export class Amount extends ValueObject {
  get value(): number {
    return this.value;
  }

  public static create(amount: number): Result<Amount, DomainError> {
    if (this.isNegative(amount))
      return err(new PaymentErrors.AmountIsNegativeError());
    if (this.isNotInteger(amount))
      return err(new PaymentErrors.AmountIsNotIntegerError());

    return ok(new Amount({ value: amount }));
  }

  private static isNegative(amount: number): boolean {
    return amount < 0;
  }

  private static isNotInteger(amount: number): boolean {
    return Number.isInteger(amount) === false;
  }

  private constructor(props: Props) {
    super(props);
  }
}
