import { ValueObject } from 'src/core';

interface Props {
  name: string;
  transactionId: string;
}

export type CreatePGInfoProps = Props;

export class PGInfo extends ValueObject<Props> {
  public static create(props: CreatePGInfoProps) {
    return new PGInfo(props);
  }

  private constructor(props: Props) {
    super(props);
  }
}
