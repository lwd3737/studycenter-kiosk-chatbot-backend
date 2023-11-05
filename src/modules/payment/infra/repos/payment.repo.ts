import { Injectable } from '@nestjs/common';
import { IPaymentRepo } from '../../domain/payment/IPayment.repo';
import { OrderId } from '../../domain/payment/base/order/order-id';
import { Payment } from '../../domain/payment/payment.factory';

@Injectable()
export class PaymentRepo extends IPaymentRepo {
  public async save(payment: Payment): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
  public async findByOrderId(orderId: OrderId): Promise<Payment | null> {
    throw new Error('Method not implemented.');
  }
}
