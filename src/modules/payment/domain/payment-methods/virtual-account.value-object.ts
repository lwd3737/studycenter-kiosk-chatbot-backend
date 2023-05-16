import { ValueObject } from 'src/core';

interface Props {
  bank: string;
  bankCode: string;
  customerName: string;
  accountNumber: string;
  dueDate: Date;
}

export type CreateVirtualAccountProps = Props;

export class VirtualAccount extends ValueObject<Props> {
  get bank(): string {
    return this.props.bank;
  }

  get bankCode(): string {
    return this.props.bankCode;
  }

  get accountNumber(): string {
    return this.props.accountNumber;
  }

  get dueDate(): Date {
    return this.props.dueDate;
  }

  get expired(): boolean {
    return this.props.dueDate.getTime() < Date.now();
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
