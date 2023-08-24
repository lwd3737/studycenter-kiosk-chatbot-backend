import { Injectable } from '@nestjs/common';
import { IUseCase, Result, UnknownError, err, ok } from 'src/core';
import { TicketService } from 'src/modules/ticketing';
import { ConfirmTicketPurchaseInfoError } from './confirm-ticket-purchase-info.error';
import { TextCard } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/text-card/text-card.vo';
import { ButtonActionType } from 'src/modules/kakao-chatbot/domain/basic-template-outputs/button/button.value-object';

type UseCaseInput = {
  ticketId: string;
  roomId: string;
  seatId: string;
};
type UseCaseResult = Result<TextCard, ConfirmTicketPurchaseInfoError>;

@Injectable()
export class ConfirmTicketPurchaseInfoUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(private ticketService: TicketService) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const ticketOrError = await this.ticketService.findById(input.ticketId);
      if (ticketOrError.isErr()) return err(ticketOrError.error);
      const ticket = ticketOrError.value;

      const textCardOrError = TextCard.create({
        text: `구매상품: ${ticket.fullTitle}\n이용시간: ${ticket.time.display}\n이용금액: ${ticket.price.value}원`,
        buttons: [
          {
            label: '구매하기',
            action: ButtonActionType.BLOCK,
            blockId: process.env.PAYMENT_FOR_TICKET_BLOCK_ID,
            extra: {
              ticketing: {
                ticket_id: input.ticketId,
                room_id: input.roomId,
                seat_id: input.seatId,
              },
            },
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
