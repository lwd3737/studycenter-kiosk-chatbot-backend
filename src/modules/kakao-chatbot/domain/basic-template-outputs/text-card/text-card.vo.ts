import { Result, ValueObject, combine, err, ok } from 'src/core';
import { Button, ButtonProps } from '../button/button.value-object';
import { TextCardError } from './text-card.error';

export type TextCardProps = {
  text: string;
  buttons?: Button[];
};
export type CreateTextCardProps = {
  text: string;
  buttons?: ButtonProps[];
};

export class TextCard extends ValueObject<TextCardProps> {
  public static create(
    props: CreateTextCardProps,
  ): Result<TextCard, TextCardError> {
    if (props.buttons) {
      const buttonsOrError = combine(
        ...props.buttons.map((buttonProps) => Button.create(buttonProps)),
      );
      if (buttonsOrError.isErr()) return err(buttonsOrError.error);

      return ok(
        new TextCard({
          text: props.text,
          buttons: buttonsOrError.value,
        }),
      );
    }

    return ok(new TextCard({ text: props.text }));
  }

  private constructor(props: TextCardProps) {
    super(props);
  }

  get text(): string {
    return this.props.text;
  }

  get buttons(): Button[] | undefined {
    return this.props.buttons;
  }
}
