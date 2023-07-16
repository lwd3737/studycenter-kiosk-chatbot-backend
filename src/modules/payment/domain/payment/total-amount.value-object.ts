import { DomainError, Result, ValueObject, err, ok } from 'src/core';
import { PaymentErrors } from '../errors/payment.error';

interface Props {
  value: number;
}

export type CreateAmountProps = number;

export class PaymentTotalAmount extends ValueObject<Props> {
  get value(): number {
    return this.props.value;
  }

  public static create(
    amount: number,
  ): Result<PaymentTotalAmount, DomainError> {
    if (this.isNegative(amount))
      return err(new PaymentErrors.AmountIsNegativeError());
    if (this.isNotInteger(amount))
      return err(new PaymentErrors.AmountIsNotIntegerError());

    return ok(new PaymentTotalAmount({ value: amount }));
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
