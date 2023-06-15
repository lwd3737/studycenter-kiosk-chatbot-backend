import { ValueObject } from 'src/core';
import { ContextValue, ContextValueProps } from './value.value-object';

export interface ContextControlProps {
  values: ContextValue[];
}

type CreateProps = {
  values: ContextValueProps[];
};

export class ContextControl extends ValueObject<ContextControlProps> {
  get values(): ContextValue[] {
    return this.props.values;
  }

  public static create(props: CreateProps): ContextControl {
    return new ContextControl({
      values: props.values.map((value) => ContextValue.create(value)),
    });
  }

  private constructor(props: ContextControlProps) {
    super(props);
  }
}
