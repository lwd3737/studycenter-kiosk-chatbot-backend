import { err, ok } from 'src/core';
import {
  CreateVirtualAccountPaymentProps,
  VIRTUAL_ACCOUNT_METHOD,
  VirtualAccountMethod,
  VirtualAccountPayment,
} from './virtual-account-payment/virtual-account-payment.aggregate-root';
import { PaymentErrors } from '../errors/payment.error';

type FactoryProps = {
  method: VirtualAccountMethod;
  props: CreateVirtualAccountPaymentProps;
};
export type PaymentFactoryResult = ReturnType<typeof PaymentFactory.create>;
export type Payment = VirtualAccountPayment;

export class PaymentFactory {
  public static create(props: FactoryProps, id?: string) {
    const { method, ...payment } = props;

    switch (method) {
      case VIRTUAL_ACCOUNT_METHOD:
        return VirtualAccountPayment.create(payment.props, id);
      default:
        return err(new PaymentErrors.InvalidPaymentMethodTypeError());
    }
  }
}
