import { DomainError, Result, err, ok } from 'src/core';
import {
  CreateVirtualAccountProps,
  VirtualAccount,
} from './virtual-account.value-object';
import { PaymentErrors } from '../errors/payment.error';

export type PaymentMethodType = 'VIRTUAL_ACCOUNT';

export type PaymentMethod = VirtualAccount;

export type CreatePaymentMethodProps = CreateVirtualAccountProps;

export class PaymentMethodFactory {
  public static create(
    type: PaymentMethodType,
    props: CreatePaymentMethodProps,
  ): Result<PaymentMethod, DomainError> {
    switch (type) {
      case 'VIRTUAL_ACCOUNT':
        if (!VirtualAccount.isValidProps(props))
          return err(new PaymentErrors.InvalidPaymentMethodPropsError());
        return ok(VirtualAccount.create(props));
      default:
        return err(new PaymentErrors.InvalidPaymentMethodTypeError());
    }
  }
}
