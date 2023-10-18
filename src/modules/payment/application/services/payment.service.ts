import { Inject, Injectable } from '@nestjs/common';
import {
  IPaymentRepo,
  PaymentRepoProvider,
} from '../../domain/payment/IPayment.repo';
import { PGRepo, PGRepoProvider } from '../../infra/repos/PG.repo';
import { Member } from 'src/modules/member';
import { Ticket } from 'src/modules/ticketing';
import { ProductType } from '../../domain/payment/base/order/product.value-object';
import { VirtualAccountPayment } from '../../domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PaymentRepoProvider) private paymentRepo: IPaymentRepo,
    @Inject(PGRepoProvider) private pgRepo: PGRepo,
  ) {}

  public async issueVirtualAccount(input: {
    member: Member;
    ticket: Ticket;
  }): Promise<VirtualAccountPayment> {
    const virtualAccountPayment = await this.pgRepo.issueVirtualAccount(
      input.member.memberId,
      {
        customerName: input.member.nickName,
      },
      {
        name: input.ticket.title,
        product: {
          id: input.ticket.ticketId.value,
          type: ProductType.TICKET,
          name: input.ticket.title,
          price: input.ticket.price.value,
        },
      },
    );

    await this.paymentRepo.save(virtualAccountPayment);

    return virtualAccountPayment;
  }
}
