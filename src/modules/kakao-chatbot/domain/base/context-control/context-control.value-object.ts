import { ValueObject } from 'src/core';
import { ContextValue } from './context-value.value-object';

export interface ContextControlProps {
  values: ContextValue[];
}

export class ContextControl extends ValueObject<ContextControlProps> {
  get values(): ContextValue[] {
    return this.props.values;
  }

  public static create(props: ContextControlProps): ContextControl {
    return new ContextControl(props);
  }

  private constructor(props: ContextControlProps) {
    super(props);
  }
}
