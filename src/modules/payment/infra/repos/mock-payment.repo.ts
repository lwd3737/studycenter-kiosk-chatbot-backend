import { IPaymentRepo } from 'src/modules/payment/domain/payment/IPayment.repo';
import { VirtualAccountPayment } from 'src/modules/payment/domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';
import { MockPaymentMapper } from '../mappers/mocks/mock-payment.mapper';
import { Injectable } from '@nestjs/common';
import { OrderId } from 'src/modules/payment/domain/payment/base/order/order-id';
import { Payment } from 'src/modules/payment/domain/payment/payment.factory';
import { RepoError } from 'src/core';

export type MockPaymentSchema = {
  id: string;
  method: 'virtualAccount';
  memberId: string;
  order: {
    id: string;
    name: string;
    product: {
      id: string;
      type: 'TICKET';
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

const ERROR_TYPE = 'MockPaymentRepo';

@Injectable()
export class MockPaymentRepo extends IPaymentRepo {
  private storage: MockPaymentSchema[] = [];

  public async save(payment: VirtualAccountPayment): Promise<Payment> {
    const raw = MockPaymentMapper.toPersistence(payment);
    this.storage.push(raw);

    const found = await this.findByOrderId(payment.order.id);
    if (!found) throw new RepoError(`[${ERROR_TYPE}]Payment not created`);

    return found;
  }

  public async findByOrderId(orderId: OrderId): Promise<Payment | null> {
    const found = this.storage.find(
      (payment) => payment.order.id === orderId.value,
    );
    return found ? MockPaymentMapper.toDomain(found) : null;
  }
}
