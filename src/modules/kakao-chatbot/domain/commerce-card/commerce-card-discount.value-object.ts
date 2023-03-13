import { err, ok, Result, Validation, ValueObject } from 'src/core';
import {
  CommerceCardDiscountError,
  CommerceCardDiscountErrors,
} from '../errors';

export interface CommerceCardDiscountProps {
  priceToDiscount?: number;
  rate?: number;
  discountedPrice?: number;
}

export class CommerceCardDiscount extends ValueObject<CommerceCardDiscountProps> {
  protected validation: Validation;

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
  ): Result<CommerceCardDiscount, CommerceCardDiscountError> {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new CommerceCardDiscount(props));
  }

  protected static validate(
    props: CommerceCardDiscountProps,
  ): Result<null, CommerceCardDiscountError> {
    if (
      !this.isDiscountedPriceIncludedWhenRateIsIncluded(
        props.rate,
        props.discountedPrice,
      )
    ) {
      return err(
        new CommerceCardDiscountErrors.DiscountedPriceNotIncludedWhenRateIsIncludedError(),
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
