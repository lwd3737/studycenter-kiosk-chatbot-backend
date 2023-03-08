import { Inject, Injectable } from '@nestjs/common';
import {
  AppErrors,
  Changes,
  IUseCase,
  WithChanges,
} from 'src/core/application';
import { err, ok, Result } from 'src/core/result';
import { Ticket } from '../../domain';
import { TicketInitService } from '../../domain/services';
import {
  ITicketRepo,
  TicketRepoProvider,
} from '../../domain/ticket.repo.interface';

type InitTicketsResult = Result<null, AppErrors.UnexpectedError>;

@Injectable()
export class InitTicketUseCase
  implements IUseCase<never, InitTicketsResult>, WithChanges
{
  changes: Changes;

  constructor(
    @Inject(TicketRepoProvider) private ticketRepo: ITicketRepo,
    private initTicketsService: TicketInitService,
  ) {
    this.changes = new Changes();
  }

  async execute(): Promise<InitTicketsResult> {
    try {
      this.changes.addChange(this.initTicketsService.initToDefault());

      const changesResult = this.changes.getChangesResult();
      if (changesResult.isErr()) {
        return err(changesResult.error);
      }

      const tickets = changesResult.value[0] as Ticket[];

      await this.ticketRepo.clear();
      await this.ticketRepo.bulkCreate(tickets);

      return ok(null);
    } catch (error) {
      return err(new AppErrors.UnexpectedError(error));
    }
  }
}
