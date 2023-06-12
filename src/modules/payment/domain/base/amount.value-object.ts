import { DomainError, Result, ValueObject, err, ok } from 'src/core';
import { PaymentErrors } from '../errors/payment.error';

interface Props {
  value: number;
}

export type CreateAmountProps = Props;

export class Amount extends ValueObject {
  get value(): number {
    return this.value;
  }

  public static create(props: Props): Result<Amount, DomainError> {
    if (this.isNegative(props))
      return err(new PaymentErrors.AmountIsNegativeError());
    if (this.isNotInteger(props))
      return err(new PaymentErrors.AmountIsNotIntegerError());

    return ok(new Amount(props));
  }

  private static isNegative(props: CreateAmountProps): boolean {
    return props.value < 0;
  }

  private static isNotInteger(props: CreateAmountProps): boolean {
    return Number.isInteger(props.value) === false;
  }

  private constructor(props: Props) {
    super(props);
  }
}
