import { Injectable } from '@nestjs/common';
import { IUseCase, Result, UnknownError, err, ok } from 'src/core';
import { TicketId, TicketService } from 'src/modules/ticketing';
import {
  SelectSeatAndConfirmTicketPurchaseInfoError,
  TicketNotFoundError,
  TicketNotSelectedError,
} from './confirm-ticket-purchase-info.error';
import { TextCard } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/text-card/text-card.vo';
import { ButtonActionType } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/button/button.value-object';
import { TicketingContextService } from 'src/modules/ticketing/application/services/ticketing-context.service';

type UseCaseInput = {
  appUserId: string;
  seatId: string;
};
type UseCaseResult = Result<
  TextCard,
  SelectSeatAndConfirmTicketPurchaseInfoError
>;

@Injectable()
export class ConfirmTicketPurchaseInfoUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(
    private ticketService: TicketService,
    private ticketingContextService: TicketingContextService,
  ) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const { ticketId } =
        this.ticketingContextService.get(input.appUserId) ?? {};
      if (!ticketId) return err(new TicketNotSelectedError(input.appUserId));

      const foundTicket = await this.ticketService.findOneById(
        new TicketId(ticketId),
      );
      if (!foundTicket) return err(new TicketNotFoundError(ticketId));

      this.ticketingContextService.save(input.appUserId, {
        seatId: input.seatId,
      });

      const textCardOrError = TextCard.create({
        text: `구매상품: ${foundTicket.fullTitle}\n이용시간: ${foundTicket.usageDuration.display}\n이용금액: ${foundTicket.price.value}원`,
        buttons: [
          {
            label: '구매하기',
            action: ButtonActionType.BLOCK,
            blockId: process.env.PAYMENT_FOR_TICKET_BLOCK_ID,
          },
        ],
      });
      if (textCardOrError.isErr()) return err(textCardOrError.error);

      return ok(textCardOrError.value);
    } catch (error) {
      return err(new UnknownError(error.message));
    }
  }
}
