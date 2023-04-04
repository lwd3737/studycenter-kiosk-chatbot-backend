// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class ValueObject<T = {}> {
  protected props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }
}
