import { ValueObject } from 'src/core';

interface Props {
  bank: string;
  accountNumber: string;
  upcomingDepositDate: Date;
}

export type CreateVirtualAccountProps = Props;

export class VirtualAccount extends ValueObject<Props> {
  get bank(): string {
    return this.props.bank;
  }

  get accountNumber(): string {
    return this.props.accountNumber;
  }

  get upcomingDepositDate(): Date {
    return this.props.upcomingDepositDate;
  }

  public static create(props: CreateVirtualAccountProps) {
    return new VirtualAccount(props);
  }

  public static isValidProps(props: any): props is CreateVirtualAccountProps {
    return (
      typeof props.bank === 'string' &&
      typeof props.accountNumber === 'string' &&
      props.upcomingDepositDate instanceof Date
    );
  }

  private constructor(props: Props) {
    super(props);
  }
}
