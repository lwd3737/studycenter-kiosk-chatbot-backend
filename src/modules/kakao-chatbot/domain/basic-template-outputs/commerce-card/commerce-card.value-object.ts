import { err, ok, Result, ValueObject } from 'src/core';
import { Button } from '../button/button.value-object';
import { CommerceCardError, CommerceCardErrors } from './commerce-card.error';
import { Profile } from '../profile/profile.value-object';
import { Thumbnail } from '../thumbnail/thumbnail.value-object';
import { Discount } from './discount.value-object';

export interface CommerceCardProps {
  description: string;
  price: number;
  currency: 'won';
  discount?: Discount;
  thumbnails: Thumbnail[];
  profile?: Profile;
  buttons: Button[];
}

export type CommerceCardInput = Omit<CommerceCardProps, 'currency'>;

export class CommerceCard extends ValueObject<CommerceCardProps> {
  private static THUMBNAIL_NUMBER = 1;
  private static MIN_BUTTON_NUMBER = 1;
  private static MAX_BUTTON_NUMBER = 3;

  get description(): string {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get currency(): string {
    return this.props.currency;
  }

  get discount(): Discount | undefined {
    return this.props.discount;
  }

  get thumbnails(): Thumbnail[] {
    return this.props.thumbnails;
  }

  get profile(): Profile | undefined {
    return this.props.profile;
  }

  get buttons(): Button[] {
    return this.props.buttons;
  }

  public static create(
    props: CommerceCardInput,
  ): Result<CommerceCard, CommerceCardError> {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new CommerceCard({ ...props, currency: 'won' }));
  }

  protected static validate(
    props: CommerceCardInput,
  ): Result<null, CommerceCardError> {
    if (this.isInvlidThumbnailNumber(props.thumbnails)) {
      return err(new CommerceCardErrors.InvalidThumbnailNumberError());
    }

    if (this.isInvalidButtonNumber(props.buttons)) {
      return err(new CommerceCardErrors.InvalidButtonNumberError());
    }

    return ok(null);
  }

  private static isInvlidThumbnailNumber(thumbnails: Thumbnail[]): boolean {
    return thumbnails.length !== this.THUMBNAIL_NUMBER;
  }

  private static isInvalidButtonNumber(buttons: Button[]) {
    const buttonNumber = buttons.length;

    return (
      buttonNumber < this.MIN_BUTTON_NUMBER ||
      buttonNumber > this.MAX_BUTTON_NUMBER
    );
  }

  private constructor(props: CommerceCardProps) {
    super(props);
  }
}
