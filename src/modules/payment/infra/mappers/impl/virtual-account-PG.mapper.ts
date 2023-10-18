import { VirtualAccountPayment } from 'src/modules/payment/domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';
import { PGSchema } from '../../repos/schema/PG.schema';
import { Order } from 'src/modules/payment/domain/payment/base/order/order.entity';
import { RepoError } from 'src/core';

export class VirtualAccountPGMapper {
  static toDomain(raw: {
    memberId: string;
    ticketId: string;
    order: Order;
    pg: PGSchema & { bank: string };
  }): VirtualAccountPayment {
    if (!raw.pg.virtualAccount)
      throw new RepoError('virtualAccount is not defined.');
    const domainOrError = VirtualAccountPayment.create({
      memberId: raw.memberId,
      order: {
        id: raw.order.id,
        name: raw.pg.orderName,
        product: {
          id: raw.ticketId,
          type: raw.order.product.type,
          name: raw.order.product.name,
          price: raw.order.product.price,
        },
      },
      secret: raw.pg.secret,
      totalAmount: raw.pg.totalAmount,
      status: raw.pg.status,
      ...raw.pg.virtualAccount,
      bank: raw.pg.bank,
      dueDate: new Date(raw.pg.virtualAccount.dueDate),
    });
    if (domainOrError.isErr()) throw domainOrError.error;

    return domainOrError.value;
  }
}
