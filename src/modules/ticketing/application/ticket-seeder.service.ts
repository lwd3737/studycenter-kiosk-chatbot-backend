import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import ticketsData from '../infra/seeds/tickets.data.json';
import { Ticket } from '../domain/ticket/ticket.aggregate-root';
import {
  ITicketRepo,
  TicketRepoProvider,
} from '../domain/ticket/ticket.repo.interface';
import { DomainError, Result, err, ok } from 'src/core';

@Injectable()
export class TicketSeederService implements OnApplicationBootstrap {
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  async onApplicationBootstrap() {
    if ((await this.ticketRepo.isEmpty()) === true) {
      const seedOrError = await this.seed();
      if (seedOrError.isErr()) {
        throw seedOrError.error;
      }

      console.log('ticket seeding successfully');
    }
  }

  public async seed(): Promise<Result<Ticket[], DomainError>> {
    const tickets: Ticket[] = [];
    for (const index in ticketsData) {
      const ticketOrError = Ticket.create(ticketsData[index]);
      if (ticketOrError.isErr()) {
        return err(ticketOrError.error);
      }

      tickets.push(ticketOrError.value);
    }

    await this.ticketRepo.bulkCreate(tickets);

    return ok(tickets);
  }
}
