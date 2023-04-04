import { Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { Ticket } from 'src/modules/ticketing/domain/ticket/ticket.aggregate-root';
import { ContextControl } from '../../domain/context-control/context-control.value-object';
import { ContextValue } from '../../domain/context-control/context-value.value-object';
import { SimpleText } from '../../domain/simple-text/simple-text.value-object';
import { SelectTicketSimpleTextError } from './select-ticket-simple-text.error';

type UseCaseInput = {
  ticket: Ticket;
};

type UseCaseResult = Promise<
  Result<
    { simpleText: SimpleText; contextControl: ContextControl },
    SelectTicketSimpleTextError
  >
>;

@Injectable()
export class SelectTicketSimpleTextUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const getSeatStatusSimpleTextResult = SimpleText.create({
        text: '룸을 선택해주세요',
      });
      if (getSeatStatusSimpleTextResult.isErr()) {
        return err(getSeatStatusSimpleTextResult.error);
      }

      const contextControl = ContextControl.create({
        values: [
          ContextValue.create({
            name: 'purchasing_ticket',
            lifeSpan: 10,
            params: {
              ticket_title: input.ticket.title,
            },
          }),
        ],
      });

      return ok({
        simpleText: getSeatStatusSimpleTextResult.value,
        contextControl: contextControl,
      });
    } catch (error) {
      return err(new AppErrors.UnexpectedError((error as Error).message));
    }
  }
}
