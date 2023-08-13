import { IRepo } from 'src/core/domain/repo.interface';
import { Payment } from './payment.factory';
import { OrderId } from './base/order/order-id';

export const PaymentRepoProvider = Symbol('PaymentRepo');

export interface IPaymentRepo extends IRepo<Payment> {
  save(payment: Payment): Promise<void>;
  findByOrderId(orderId: OrderId): Promise<Payment | null>;
}
