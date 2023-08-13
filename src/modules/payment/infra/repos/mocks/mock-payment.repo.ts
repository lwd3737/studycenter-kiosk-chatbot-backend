import { IPaymentRepo } from 'src/modules/payment/domain/payment/IPayment.repo';
import { VirtualAccountPayment } from 'src/modules/payment/domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';
import { MockPaymentMapper } from '../../mappers/mocks/mock-payment.mapper';
import { Injectable } from '@nestjs/common';
import { OrderId } from 'src/modules/payment/domain/payment/base/order/order-id';
import { Payment } from 'src/modules/payment/domain/payment/payment.factory';

export type MockPaymentSchema = {
  id: string;
  method: 'virtualAccount';
  memberId: string;
  order: {
    id: string;
    name: string;
    product: {
      type: 'ticket';
      name: string;
      price: number;
    };
  };
  totalAmount: number;
  status:
    | 'READY'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_DEPOSIT'
    | 'DONE'
    | 'CANCELED'
    | 'PARTIAL_CANCELED'
    | 'ABORTED'
    | 'EXPIRED';
  secret: string | null;
  virtualAccount: {
    bank: string;
    bankCode: string;
    customerName: string;
    accountNumber: string;
    dueDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MockPaymentRepo implements IPaymentRepo {
  private storage: MockPaymentSchema[] = [];

  async save(payment: VirtualAccountPayment): Promise<void> {
    const raw = MockPaymentMapper.toPersistence(payment);
    this.storage.push(raw);
  }

  async findByOrderId(orderId: OrderId): Promise<Payment | null> {
    const found = this.storage.find(
      (payment) => payment.order.id === orderId.value,
    );
    return found ? MockPaymentMapper.toDomain(found) : null;
  }
}
