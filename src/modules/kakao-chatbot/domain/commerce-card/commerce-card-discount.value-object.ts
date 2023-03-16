import { err, ok, Result, ValueObject } from 'src/core';
import { CommerceCardErrors } from '../errors/commerce-card.error';

export interface CommerceCardDiscountProps {
  priceToDiscount?: number;
  rate?: number;
  discountedPrice?: number;
}

export class CommerceCardDiscount extends ValueObject<CommerceCardDiscountProps> {
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
    props: CommerceCardDiscountProps,
  ): Result<
    CommerceCardDiscount,
    CommerceCardErrors.DiscountedPriceNotIncludedWhenRateIsIncludedError
  > {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new CommerceCardDiscount(props));
  }

  protected static validate(
    props: CommerceCardDiscountProps,
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

  protected constructor(props: CommerceCardDiscountProps) {
    super(props);
  }
}
