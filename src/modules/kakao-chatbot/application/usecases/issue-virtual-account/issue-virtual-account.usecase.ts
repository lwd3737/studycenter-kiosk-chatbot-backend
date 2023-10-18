import { IUseCase, Result, UnknownError, err, ok } from 'src/core';
import { Injectable } from '@nestjs/common';
import { SimpleText } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/simple-text/simple-text.value-object';
import { PaymentService } from 'src/modules/payment/application/services/payment.service';
import * as ticketErrors from 'src/modules/ticketing';
import {
  IssueVirtualAccountError,
  MemberNotFoundError,
  SimpleTextCreationFailedError,
  TicketNotFoundError,
  TicketNotSelectedError,
} from './issue-virtual-account.error';
import { TicketingContextService } from 'src/modules/ticketing/application/services/ticketing-context.service';
import { TicketService } from 'src/modules/ticketing';
import { MemberService } from 'src/modules/member';

type UseCaseInput = {
  appUserId: string;
};
type UseCaseResult = Result<SimpleText, IssueVirtualAccountError>;

@Injectable()
export class IssueVirtualAccountUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    private ticketingContextService: TicketingContextService,
    private ticketService: TicketService,
    private paymentService: PaymentService,
    private memberService: MemberService,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const foundMember = await this.memberService.findByAppUserId(
        input.appUserId,
      );
      if (!foundMember) return err(new MemberNotFoundError(input.appUserId));

      const { ticketId } =
        this.ticketingContextService.get(input.appUserId) ?? {};
      if (!ticketId) return err(new TicketNotSelectedError(input.appUserId));

      const foundTicket = await this.ticketService.findOneById(
        new ticketErrors.TicketId(ticketId),
      );
      if (!foundTicket) return err(new TicketNotFoundError(ticketId));

      const virtualAccountPayment =
        await this.paymentService.issueVirtualAccount({
          member: foundMember,
          ticket: foundTicket,
        });

      const simpleTextOrError = SimpleText.create({
        value: `가상계좌 발급이 완료되었습니다.\n한 번만 입금 가능한 일회용 계좌번호입니다.\n정확한 금액을 한 번에 입금해주세요.\n\n은행명: ${virtualAccountPayment.bank}\n계좌번호: ${virtualAccountPayment.accountNumber}\n금액: ${virtualAccountPayment.totalAmount.value}원\n예금주: ${virtualAccountPayment.customerName}\n입금기한: ${virtualAccountPayment.dueDate?.formatted}`,
      });
      if (simpleTextOrError.isErr())
        return err(
          new SimpleTextCreationFailedError(simpleTextOrError.error.message),
        );

      return ok(simpleTextOrError.value);
    } catch (error) {
      return err(new UnknownError(error.message));
    }
  }
}
