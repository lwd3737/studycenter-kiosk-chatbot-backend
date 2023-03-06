import { AnyObject } from 'src/shared/types';

export abstract class ValueObject<T extends AnyObject> {
  protected props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }
}
