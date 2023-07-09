import { AppErrors, IUseCase, Result, err, ok } from 'src/core';
import { IssueVirtualAccountUseCase } from 'src/modules/payment';
import {
  TemplateVirtualAccountIssuanceError,
  TemplateVirtualAccountIssuanceErrors,
} from './error';
import { IssueVirtualAccountErrors } from 'src/modules/payment/usecases/issue-virtual-account/errors';
import { SimpleText } from '../../domain/base/simple-text/simple-text.value-object';
import { Injectable } from '@nestjs/common';

type UseCaseInput = {
  appUserId: string;
  ticketId: string;
  roomId: string;
  // seatId: string;
};
type UseCaseResult = Result<SimpleText, TemplateVirtualAccountIssuanceError>;

@Injectable()
export class TemplateVirtualAccountUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(private issueVirtualAccountUseCase: IssueVirtualAccountUseCase) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const paymentOrError = await this.issueVirtualAccountUseCase.execute({
        ...input,
      });
      if (paymentOrError.isErr()) {
        const error = paymentOrError.error;

        switch (error.constructor) {
          case IssueVirtualAccountErrors.MemberNotFound:
            return err(
              new TemplateVirtualAccountIssuanceErrors.MemberNotFound(
                input.appUserId,
              ),
            );
          case IssueVirtualAccountErrors.TicketNotFound:
            return err(
              new TemplateVirtualAccountIssuanceErrors.TicketNotFound(
                input.ticketId,
              ),
            );
          default:
            throw error;
        }
      }

      const simpleTextOrError = SimpleText.create({
        value: `가상계좌 발급이 완료되었습니다.\n\n은행명: ${paymentOrError.value.bank}\n계좌번호: ${paymentOrError.value.accountNumber}\n예금주: ${paymentOrError.value.customerName}\n입금기한: ${paymentOrError.value.dueDate}`,
      });
      if (simpleTextOrError.isErr()) return err(simpleTextOrError.error);

      return ok(simpleTextOrError.value);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
