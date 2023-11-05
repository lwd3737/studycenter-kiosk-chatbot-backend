import { IMapper } from 'src/core';
import {
  Payment,
  PaymentFactory,
} from 'src/modules/payment/domain/payment/payment.factory';
import { MockPaymentSchema } from '../../repos/mock-payment.repo';
import { MemberId } from 'src/modules/member/domain/member/member-id';
import { ProductType } from 'src/modules/payment/domain/payment/base/order/product.value-object';
import { OrderId } from 'src/modules/payment/domain/payment/base/order/order-id';

export class MockPaymentMapper implements IMapper<Payment> {
  static toDomain(raw: MockPaymentSchema): Payment {
    const paymentOrError = PaymentFactory.create(
      {
        method: raw.method,
        props: {
          memberId: raw.memberId,
          order: {
            id: new OrderId(raw.order.id),
            name: raw.order.name,
            product: {
              id: raw.order.product.id,
              type: ProductType[raw.order.product.type],
              name: raw.order.product.name,
              price: raw.order.product.price,
            },
          },
          totalAmount: raw.totalAmount,
          status: raw.status,
          secret: raw.secret,
          bank: raw.virtualAccount?.bank,
          bankCode: raw.virtualAccount?.bankCode,
          customerName: raw.virtualAccount?.customerName,
          accountNumber: raw.virtualAccount?.accountNumber,
          dueDate: raw.virtualAccount?.dueDate,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        },
      },
      raw.id,
    );
    if (paymentOrError.isErr()) throw paymentOrError.error;

    return paymentOrError.value;
  }

  static toPersistence(domain: Payment): MockPaymentSchema {
    return {
      id: domain.id.value,
      method: domain.method,
      memberId: domain.memberId.value,
      order: {
        id: domain.order.id.value,
        name: domain.order.name,
        product: {
          id: domain.order.product.id,
          type: domain.order.product.type,
          name: domain.order.product.name,
          price: domain.order.product.price,
        },
      },
      totalAmount: domain.totalAmount.value,
      status: domain.status.value,
      secret: domain.secret,
      virtualAccount: {
        bank: domain.bank,
        bankCode: domain.bankCode,
        customerName: domain.customerName,
        accountNumber: domain.accountNumber,
        dueDate: domain.dueDate.value,
      },
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
