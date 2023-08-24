import { ValueObject } from 'src/core';

export interface TicketTypeProps<T> {
  value: T;
}

export abstract class TicketType<T = string> extends ValueObject<
  TicketTypeProps<T>
> {
  protected constructor(props: TicketTypeProps<T>) {
    super(props);
  }

  get value(): T {
    return this.props.value;
  }

  abstract get display(): string;
}
