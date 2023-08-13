import { err, ok, Result, ValueObject } from 'src/core';
import { CommerceCardErrors } from './commerce-card.error';

export interface DiscountProps {
  priceToDiscount?: number;
  rate?: number;
  discountedPrice?: number;
}

export class Discount extends ValueObject<DiscountProps> {
  get priceToDiscount(): number | undefined {
    return this.props.priceToDiscount;
  }

  get rate(): number | undefined {
    return this.props.rate;
  }

  get discountedPrice(): number | undefined {
    return this.props.discountedPrice;
  }

  public static create(
    props: DiscountProps,
  ): Result<
    Discount,
    CommerceCardErrors.DiscountedPriceNotIncludedWhenRateIsIncludedError
  > {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new Discount(props));
  }

  protected static validate(
    props: DiscountProps,
  ): Result<
    null,
    CommerceCardErrors.DiscountedPriceNotIncludedWhenRateIsIncludedError
  > {
    if (
      !this.isDiscountedPriceIncludedWhenRateIsIncluded(
        props.rate,
        props.discountedPrice,
      )
    ) {
      return err(
        new CommerceCardErrors.DiscountedPriceNotIncludedWhenRateIsIncludedError(),
      );
    }

    return ok(null);
  }

  private static isDiscountedPriceIncludedWhenRateIsIncluded(
    rate?: number,
    discountedPrice?: number,
  ): boolean {
    if (rate) {
      return !!discountedPrice;
    }

    return true;
  }

  protected constructor(props: DiscountProps) {
    super(props);
  }
}
