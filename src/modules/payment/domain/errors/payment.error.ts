import { DomainError } from 'src/core';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace PaymentErrors {
  export class AmountIsNegativeError extends DomainError {
    constructor() {
      super(`Amount is negative`);
    }
  }

  export class AmountIsNotIntegerError extends DomainError {
    constructor() {
      super(`Amount is not integer`);
    }
  }

  export class InvalidPaymentMethodPropsError extends DomainError {
    constructor() {
      super(`Invalid payment method props`);
    }
  }

  export class InvalidPaymentMethodTypeError extends DomainError {
    constructor() {
      super(`Invalid payment method type`);
    }
  }
}
