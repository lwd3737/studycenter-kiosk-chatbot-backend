import { IUseCase, Result, UnknownError, err, ok } from 'src/core';
import { Injectable } from '@nestjs/common';
import { SimpleText } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/simple-text/simple-text.value-object';
import { PaymentService } from 'src/modules/payment/application/services/payment.service';
import * as paymentErrors from 'src/modules/payment';
import * as ticketErrors from 'src/modules/ticketing';
import {
  IssueVirtualAccountError,
  MemberNotFoundError,
  SimpleTextCreationFailedError,
  TicketNotFoundError,
} from './issue-virtual-account.error';

type UseCaseInput = {
  appUserId: string;
  ticketId: string;
  roomId: string;
};
type UseCaseResult = Result<SimpleText, IssueVirtualAccountError>;

@Injectable()
export class IssueVirtualAccountUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(private paymentService: PaymentService) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const paymentOrError = await this.paymentService.issueVirtualAccount(
        input,
      );
      if (paymentOrError.isErr()) {
        const error = paymentOrError.error;

        if (error instanceof paymentErrors.MemberNotFoundError)
          return err(new MemberNotFoundError(error.metadata.appUserId));
        if (error instanceof ticketErrors.TicketNotFoundError)
          return err(new TicketNotFoundError(error.metadata.ticketId));

        throw error;
      }

      const virtualAccountPayment = paymentOrError.value;
      const simpleTextOrError = SimpleText.create({
        value: `가상계좌 발급이 완료되었습니다.\n\n은행명: ${virtualAccountPayment.bank}\n계좌번호: ${paymentOrError.value.accountNumber}\n예금주: ${paymentOrError.value.customerName}\n입금기한: ${paymentOrError.value.dueDate?.formatted}
        `,
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
