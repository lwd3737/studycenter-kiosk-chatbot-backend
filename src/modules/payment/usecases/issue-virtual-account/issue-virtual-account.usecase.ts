import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, IUseCase, Result, err, ok } from 'src/core';
import { PGRepo, PGRepoProvider } from '../../infra/repos/PG.repo';
import {
  GetMemberErrors,
  GetMemberUseCase,
  Member,
} from 'src/modules/membership';
import { IssueVirtualAccountError, IssueVirtualAccountErrors } from './errors';
import { GetTicketUseCase } from 'src/modules/ticketing/application/usecases/get-ticket/get-ticket.usecase';
import { GetTicketErrors, Ticket } from 'src/modules/ticketing';
import { VirtualAccountPayment } from '../../domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';
import { MemberId } from 'src/modules/membership/domain/member/member-id';

type UseCaseInput = {
  appUserId: string;
  ticketId: string;
  roomId: string;
};
type UseCaseResult = Result<any, IssueVirtualAccountError>;

@Injectable()
export class IssueVirtualAccountUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  private readonly bank: string;
  private readonly bankCode: string;
  private readonly virtualAccountNumber: string;

  constructor(
    @Inject(PGRepoProvider) private pgRepo: PGRepo,
    private getMemberUseCase: GetMemberUseCase,
    private getTicketUseCase: GetTicketUseCase,
  ) {
    const { BANK, BANK_CODE, VIRTUAL_ACCOUNT_NUMBER } = process.env;
    if (!BANK) throw new Error('BANK env viriable is not defined.');
    if (!BANK_CODE) throw new Error('BANK_CODE env viriable is not defined.');
    if (!VIRTUAL_ACCOUNT_NUMBER)
      throw new Error('VIRTUAL_ACCOUNT_NUMBER env viriable is not defined.');

    this.bank = BANK;
    this.bankCode = BANK_CODE;
    this.virtualAccountNumber = VIRTUAL_ACCOUNT_NUMBER;
  }

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      // const memberOrError = await this.getMember(input.appUserId);
      // if (memberOrError.isErr()) return err(memberOrError.error);
      // const member = memberOrError.value;

      const ticketOrError = await this.getTicket(input.ticketId);
      if (ticketOrError.isErr()) return err(ticketOrError.error);
      const ticket = ticketOrError.value;

      const virtualAccountPaymentOrError = VirtualAccountPayment.create({
        // memberId: member.memberId,
        memberId: new MemberId(input.appUserId),
        bank: this.bank,
        bankCode: this.bankCode,
        // customerName: member.nickName,
        customerName: 'test',
        accountNumber: this.virtualAccountNumber,
        order: {
          ticketId: ticket.ticketId,
          name: ticket.title,
        },
        amount: ticket.price.value,
        dueDate: new Date(),
      });
      if (virtualAccountPaymentOrError.isErr())
        return err(virtualAccountPaymentOrError.error);

      const virtualAccount = await this.pgRepo.issueVirtualAccount(
        virtualAccountPaymentOrError.value,
      );

      return ok(virtualAccount);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }

  private async getMember(
    appUserId: string,
  ): Promise<Result<Member, IssueVirtualAccountErrors.MemberNotFound>> {
    const memberOrError = await this.getMemberUseCase.execute({
      appUserId,
    });
    if (memberOrError.isErr()) {
      const error = memberOrError.error;

      switch (error.constructor) {
        case GetMemberErrors.NotFound:
          return err(new IssueVirtualAccountErrors.MemberNotFound(appUserId));
        default:
          throw error;
      }
    }

    return ok(memberOrError.value);
  }

  private async getTicket(
    ticketId: string,
  ): Promise<
    Result<
      Ticket,
      IssueVirtualAccountErrors.TicketNotFound | AppErrors.UnexpectedError
    >
  > {
    const ticketOrError = await this.getTicketUseCase.execute({
      ticketId,
    });
    if (ticketOrError.isErr()) {
      const error = ticketOrError.error;

      switch (error.constructor) {
        case GetTicketErrors.NotFound:
          return err(new IssueVirtualAccountErrors.TicketNotFound(ticketId));
        default:
          throw error;
      }
    }

    return ok(ticketOrError.value);
  }
}
