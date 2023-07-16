import { ValueObject } from 'src/core';
import { formatDate } from 'src/shared/utils/date-format';

interface DueDateProps {
  value: Date;
}

export class DueDate extends ValueObject<DueDateProps> {
  get value(): Date {
    return this.props.value;
  }

  get formatted(): string {
    return formatDate(this.value);
  }

  public static create(props: DueDateProps): DueDate {
    return new DueDate(props);
  }

  private constructor(props: DueDateProps) {
    super(props);
  }
}
