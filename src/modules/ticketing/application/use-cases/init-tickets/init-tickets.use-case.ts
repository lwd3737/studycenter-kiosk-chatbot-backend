import { Inject, Injectable } from '@nestjs/common';
import {
  AppErrors,
  Changes,
  IUseCase,
  WithChanges,
} from 'src/core/application';
import { err, ok, Result } from 'src/core/result';
import { Ticket } from '../../../domain/ticket/ticket.aggregate-root';
import {
  ITicketRepo,
  TicketRepoProvider,
} from '../../../domain/ticket/ticket.repo.interface';
import { TicketSeederService } from '../../ticket-seeder.service';

type InitTicketsResult = Result<null, AppErrors.UnexpectedError>;

@Injectable()
export class InitTicketsUseCase
  implements IUseCase<never, InitTicketsResult>, WithChanges
{
  changes: Changes;

  constructor(
    @Inject(TicketRepoProvider) private ticketRepo: ITicketRepo,
    private ticketSeederService: TicketSeederService,
  ) {
    this.changes = new Changes();
  }

  async execute(): Promise<InitTicketsResult> {
    try {
      this.changes.addChange(await this.ticketSeederService.seed());

      const changesOrError = this.changes.getChangesResult();
      if (changesOrError.isErr()) {
        return err(changesOrError.error);
      }

      const tickets = changesOrError.value[0] as Ticket[];

      await this.ticketRepo.clear();
      await this.ticketRepo.bulkCreate(tickets);

      return ok(null);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
