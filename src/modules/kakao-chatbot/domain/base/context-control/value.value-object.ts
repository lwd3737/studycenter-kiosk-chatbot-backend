import { ValueObject } from 'src/core';

export interface ContextValueProps {
  name: string;
  lifeSpan: number;
  params?: Record<string, string>;
}

export class ContextValue extends ValueObject<ContextValueProps> {
  get name(): string {
    return this.props.name;
  }

  get lifeSpan(): number {
    return this.props.lifeSpan;
  }

  get params(): Record<string, string> | undefined {
    return this.props.params;
  }

  public static create(props: ContextValueProps): ContextValue {
    const lifeSpan =
      Number.isInteger(props.lifeSpan) === false
        ? Math.ceil(props.lifeSpan)
        : props.lifeSpan;

    return new ContextValue({ ...props, lifeSpan });
  }

  private constructor(props: ContextValueProps) {
    super(props);
  }
}
