import { err, ok, Result, ValueObject } from 'src/core';
import { SimpleTextError, SimpleTextErrors } from './simple-text.error';

export interface SimpleTextProps {
  value: string;
}

export class SimpleText extends ValueObject<SimpleTextProps> {
  static MAX_TEXT_LENGTH = 1000;

  get value(): string {
    return this.props.value;
  }

  public static create(
    props: SimpleTextProps,
  ): Result<SimpleText, SimpleTextError> {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new SimpleText(props));
  }

  private static validate(
    props: SimpleTextProps,
  ): Result<null, SimpleTextError> {
    if (props.value.length > this.MAX_TEXT_LENGTH) {
      return err(new SimpleTextErrors.TextMaxLengthExceededError());
    }

    return ok(null);
  }

  private constructor(props: SimpleTextProps) {
    super(props);
  }
}
