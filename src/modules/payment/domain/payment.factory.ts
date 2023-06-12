import { err, ok } from 'src/core';
import {
  CreateVirtualAccountPaymentProps,
  VirtualAccountMethod,
  VirtualAccountPayment,
} from './virtual-account-payment.aggregate-root';
import { PaymentErrors } from './errors/payment.error';

type FactoryProps = {
  method: VirtualAccountMethod;
  props: CreateVirtualAccountPaymentProps;
};

export class PaymentFactory {
  public static create(props: FactoryProps) {
    const { method, ...payment } = props;

    switch (method) {
      case 'virtual_account':
        return ok(VirtualAccountPayment.create(payment.props));
      default:
        return err(new PaymentErrors.InvalidPaymentMethodTypeError());
    }
  }
}
