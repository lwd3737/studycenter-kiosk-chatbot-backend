import { Inject, Injectable } from '@nestjs/common';
import { UnexpectedError } from 'src/core/application';
import { err, ok, Result } from 'src/shared/utils';
import { TicketEntity } from '../domain/ticket.entity';
import { ITicketRepo, TicketRepoToken } from '../domain/ticket.repo.interface';

type GetTicketsByCategoryResult = Result<TicketEntity[], UnexpectedError>;

@Injectable()
export class TicketUseCases {
  constructor(@Inject(TicketRepoToken) private ticketRepo: ITicketRepo) {}

  async init() {
    try {
      await this.ticketRepo.init();

      const ticketEntities = await this.ticketRepo.getTickets();

      return ok(ticketEntities);
    } catch (error) {
      return err(new UnexpectedError(error));
    }
  }

  async getTicketsByCategory(): Promise<GetTicketsByCategoryResult> {
    try {
      const ticketEntities = await this.ticketRepo.getTickets();

      return ok(ticketEntities);
    } catch (error) {
      return err(new UnexpectedError(error));
    }
  }
}
