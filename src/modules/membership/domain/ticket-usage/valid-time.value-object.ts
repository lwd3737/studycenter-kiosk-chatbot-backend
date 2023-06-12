import { ValueObject } from 'src/core';

interface Props {
  seconds: number;
}

export type CreateValidTimeProps = Props | { hours: number };

export class ValidTime extends ValueObject<Props> {
  get seconds(): number {
    return this.props.seconds;
  }

  get ms(): number {
    return this.props.seconds * 1000;
  }

  public static create(props: CreateValidTimeProps) {
    return new ValidTime({
      seconds: this.calculateSeconds(props),
    });
  }

  private static calculateSeconds(props: CreateValidTimeProps): number {
    if ('hours' in props) return props.hours * 60 * 60;
    return props.seconds;
  }

  private constructor(props: Props) {
    super(props);
  }
}
