import { Inject, Injectable } from '@nestjs/common';
import { AppErrors, err, IUseCase, ok, Result } from 'src/core';
import { GetTicketError, GetTicketErrors } from './get-ticket.error';
import {
  ITicketRepo,
  Ticket,
  TicketId,
  TicketRepoProvider,
} from 'src/modules/ticketing/domain';

type UseCaseInput = { ticketId: string };
type UseCaseResult = Promise<Result<Ticket, GetTicketError>>;

@Injectable()
export class GetTicketUseCase implements IUseCase<UseCaseInput, UseCaseResult> {
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  async execute(input: UseCaseInput): Promise<UseCaseResult> {
    try {
      const foundTicket = await this.ticketRepo.findOneById(
        new TicketId(input.ticketId),
      );
      if (!foundTicket)
        return err(new GetTicketErrors.NotFound(input.ticketId));

      return ok(foundTicket);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
