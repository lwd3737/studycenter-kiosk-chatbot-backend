import { ValueObject } from 'src/core';

interface Props {
  value: StatusType;
}

type StatusType = 'requested' | 'completed' | 'failed';

export type CreatePaymentStatusProps = Props;

export class PaymentStatus extends ValueObject<Props> {
  get value(): StatusType {
    return this.props.value;
  }

  public static create(props: Props) {
    return new PaymentStatus(props);
  }

  private constructor(props: Props) {
    super(props);
  }
}
