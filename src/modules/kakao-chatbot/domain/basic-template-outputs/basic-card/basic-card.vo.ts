import { DomainError, Result, ValueObject, combine, err, ok } from 'src/core';
import { Thumbnail, ThumbnailProps } from '../thumbnail/thumbnail.value-object';
import { Button, ButtonProps } from '../button/button.value-object';

export type BasicCardProps = {
  title?: string;
  description?: string;
  thumbnail: Thumbnail;
  buttons?: Button[];
};
export type CreateBasicCardProps = Pick<
  BasicCardProps,
  'title' | 'description'
> & {
  thumbnail: ThumbnailProps;
  buttons?: ButtonProps[];
};

export class BasicCard extends ValueObject<BasicCardProps> {
  public static create(
    props: CreateBasicCardProps,
  ): Result<BasicCard, DomainError> {
    if (
      props.description &&
      this.isDescriptionLengthExceeded(props.description)
    )
      return err(new DomainError('Description length exceeded'));
    if (props.buttons && this.isButtonCountExceeded(props.buttons))
      return err(new DomainError('Button count exceeded'));

    const propsOrError = combine(
      Thumbnail.create(props.thumbnail),
      ...(props.buttons?.map((button) => Button.create(button)) ?? []),
    );
    if (propsOrError.isErr()) return err(propsOrError.error);
    const [thumbnail, ...buttons] = propsOrError.value;

    return ok(
      new BasicCard({
        ...props,
        thumbnail,
        buttons,
      }),
    );
  }

  private static isDescriptionLengthExceeded(description: string): boolean {
    return description.length > 230;
  }

  private static isButtonCountExceeded(buttons: ButtonProps[]): boolean {
    return buttons.length > 3;
  }

  private constructor(props: BasicCardProps) {
    super(props);
  }

  get title(): string | undefined {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get thumbnail(): Thumbnail {
    return this.props.thumbnail;
  }

  get buttons(): Button[] {
    return this.props.buttons ?? [];
  }
}
