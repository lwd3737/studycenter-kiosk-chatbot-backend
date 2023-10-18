import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import ticketsData from '../../infra/seeds/tickets.data.json';

import { DomainError, Result, combine, err, ok } from 'src/core';
import { TicketFactory } from '../../domain/ticket-factory';
import { ITicketRepo, Ticket, TicketRepoProvider } from '../../domain';

@Injectable()
export class TicketSeederService implements OnApplicationBootstrap {
  constructor(@Inject(TicketRepoProvider) private ticketRepo: ITicketRepo) {}

  async onApplicationBootstrap() {
    if (await this.ticketRepo.isEmpty()) {
      const seedOrError = await this.seed();
      if (seedOrError.isErr()) {
        throw seedOrError.error;
      }

      console.info('ticket seeding successfully');
    }
  }

  public async seed(): Promise<Result<Ticket[], DomainError>> {
    const ticketsOrError = combine(
      ...ticketsData.map((ticketData) => {
        const ticketOrError = TicketFactory.new(ticketData.type, {
          ...ticketData,
          price: ticketData.price,
          usageDuration: ticketData.usageTime.value,
        });
        if (ticketOrError.isErr()) return err(ticketOrError.error);

        return ok(ticketOrError.value);
      }),
    );
    if (ticketsOrError.isErr()) return err(ticketsOrError.error);

    await this.ticketRepo.bulkCreate(ticketsOrError.value as Ticket[]);

    return ok(ticketsOrError.value);
  }
}
