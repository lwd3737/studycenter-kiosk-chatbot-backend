import { Inject, Injectable } from '@nestjs/common';
import {
  ITicketRepo,
  Ticket,
  TicketId,
  TicketRepoProvider,
} from '../../domain';
import { Result, err, ok } from 'src/core';
import { TicketNotFoundError } from './ticket.error';

@Injectable()
export class TicketService {
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  public async findById(
    id: string,
  ): Promise<Result<Ticket, TicketNotFoundError>> {
    const found = await this.ticketRepo.getOneById(new TicketId(id));
    if (!found) return err(new TicketNotFoundError(id));
    return ok(found);
  }
}
