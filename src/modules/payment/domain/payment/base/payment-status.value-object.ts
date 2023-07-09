import { ValueObject } from 'src/core';

interface Props {
  value: PaymentStatusType;
}
export type PaymentStatusType =
  | null
  | 'READY'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_DEPOSIT'
  | 'DONE'
  | 'CANCELED'
  | 'PARTIAL_CANCELED'
  | 'ABORTED'
  | 'EXPIRED';

export type CreatePaymentStatusProps = Props;

export class PaymentStatus extends ValueObject<Props> {
  get value(): PaymentStatusType {
    return this.props.value;
  }

  public static create(props: Props) {
    return new PaymentStatus(props);
  }

  private constructor(props: Props) {
    super(props);
  }
}
