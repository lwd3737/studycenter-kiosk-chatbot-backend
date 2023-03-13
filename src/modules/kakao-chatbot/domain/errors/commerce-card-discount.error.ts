/* eslint-disable @typescript-eslint/no-namespace */
export type CommerceCardDiscountError =
  CommerceCardDiscountErrors.DiscountedPriceNotIncludedWhenRateIsIncludedError;

import { DomainError } from 'src/core';

export namespace CommerceCardDiscountErrors {
  export class DiscountedPriceNotIncludedWhenRateIsIncludedError extends DomainError {
    constructor() {
      super(`Discounted price is not included when rate is included`);
    }
  }
}
