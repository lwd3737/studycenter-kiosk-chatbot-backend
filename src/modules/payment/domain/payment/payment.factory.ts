import { err, ok } from 'src/core';
import {
  CreateVirtualAccountPaymentProps,
  VirtualAccountMethod,
  VirtualAccountPayment,
} from './virtual-account-payment/virtual-account-payment.aggregate-root';
import { PaymentErrors } from '../errors/payment.error';

type FactoryProps = {
  method: VirtualAccountMethod;
  props: CreateVirtualAccountPaymentProps;
};
export type PaymentFactoryResult = ReturnType<typeof PaymentFactory.create>;

export class PaymentFactory {
  public static create(props: FactoryProps) {
    const { method, ...payment } = props;

    switch (method) {
      case 'VIRTUAL_ACCOUNT':
        return ok(VirtualAccountPayment.create(payment.props));
      default:
        return err(new PaymentErrors.InvalidPaymentMethodTypeError());
    }
  }
}