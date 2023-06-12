import { Inject, Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import {
  GetTicketByTimeError,
  GetTicketByTimeErrors,
} from './get-ticket-by-time.error';
import {
  ITicketRepo,
  Ticket,
  TicketRepoProvider,
  TicketTime,
} from 'src/modules/ticketing/domain';

type UseCaseInput = {
  ticketTime: TicketTime;
};

type UseCaseResult = Promise<Result<Ticket, GetTicketByTimeError>>;

@Injectable()
export class GetTicketByTimeUseCase
  implements IUseCase<UseCaseInput, UseCaseResult>
{
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    const ticket = await this.ticketRepo.getTicketByTime(input.ticketTime);
    if (ticket === null) {
      return err(
        new GetTicketByTimeErrors.TicketNotFoundError(input.ticketTime),
      );
    }

    return ok(ticket);
  }
}
