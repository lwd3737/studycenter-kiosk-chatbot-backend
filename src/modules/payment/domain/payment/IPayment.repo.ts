import { Payment } from './payment.factory';
import { OrderId } from './base/order/order-id';

export abstract class IPaymentRepo {
  abstract save(payment: Payment): Promise<Payment>;
  abstract findByOrderId(orderId: OrderId): Promise<Payment | null>;
}
