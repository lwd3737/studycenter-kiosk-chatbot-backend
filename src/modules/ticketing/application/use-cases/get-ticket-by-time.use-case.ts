import { Inject, Injectable } from '@nestjs/common';
import { err, IUseCase, ok, Result } from 'src/core';
import { TicketTime } from '../../domain/ticket/ticket-time.value-object';
import { Ticket } from '../../domain/ticket/ticket.aggregate-root';
import {
  ITicketRepo,
  TicketRepoProvider,
} from '../../domain/ticket/ticket.repo.interface';
import {
  GetTicketByTimeError,
  GetTicketByTimeErrors,
} from '../errors/get-ticket-by-time.error';

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
