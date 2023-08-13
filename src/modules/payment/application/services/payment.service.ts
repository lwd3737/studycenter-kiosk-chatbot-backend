import { Inject, Injectable } from '@nestjs/common';
import {
  IPaymentRepo,
  PaymentRepoProvider,
} from '../../domain/payment/IPayment.repo';
import { PGRepo, PGRepoProvider } from '../../infra/repos/PG.repo';
import { MemberService } from 'src/modules/member';
import { TicketService } from 'src/modules/ticketing';
import { Result, err, ok } from 'src/core';
import { ProductType } from '../../domain/payment/base/order/product.value-object';
import { VirtualAccountPayment } from '../../domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';
import {
  IssueVirtualAccountError,
  MemberNotFoundError,
  TicketNotFoundError,
} from './payment.error';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PaymentRepoProvider) private paymentRepo: IPaymentRepo,
    @Inject(PGRepoProvider) private pgRepo: PGRepo,
    private memberService: MemberService,
    private ticketService: TicketService,
  ) {}

  public async issueVirtualAccount(input: {
    appUserId: string;
    ticketId: string;
    roomId: string;
  }): Promise<Result<VirtualAccountPayment, IssueVirtualAccountError>> {
    const memberOrError = await this.memberService.findByAppUserId(
      input.appUserId,
    );
    if (memberOrError.isErr())
      return err(new MemberNotFoundError(input.appUserId));
    const member = memberOrError.value;

    const ticketOrError = await this.ticketService.findById(input.ticketId);
    if (ticketOrError.isErr())
      return err(new TicketNotFoundError(input.ticketId));
    const ticket = ticketOrError.value;

    const virtualAccountPayment = await this.pgRepo.issueVirtualAccount(
      member.memberId,
      {
        customerName: member.nickName,
      },
      {
        name: ticket.title,
        product: {
          type: ProductType.ticket,
          name: ticket.title,
          price: ticket.price.value,
        },
      },
    );

    await this.paymentRepo.save(virtualAccountPayment);

    return ok(virtualAccountPayment);
  }
}
