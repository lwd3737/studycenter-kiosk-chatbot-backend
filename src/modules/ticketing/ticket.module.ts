import { Module } from '@nestjs/common';
import { TicketMapperProvider } from './infra/mappers/ITicket.mapper';
import { InitTicketsUseCase } from './application/usecases/init-tickets/init-tickets.use-case';
import { MockTicketMapper } from './infra/mappers/impl/mock-ticket.mapper';
import { MockTicketRepo } from './infra/persistence/repos/mock-ticket.repo';
import { GetTicketUseCase } from './application/usecases/get-ticket/get-ticket.usecase';
import { TicketSeederService } from './application/services/ticket-seeder.service';
import { TicketRepoProvider } from './domain';
import { TicketService } from './application/services/ticket.service';
import { TicketingContextService } from './application/services/ticketing-context.service';

const ticketMapperProvider = {
  provide: TicketMapperProvider,
  useClass: MockTicketMapper,
};

const ticketRepoProvider = {
  provide: TicketRepoProvider,
  useClass: MockTicketRepo,
};

@Module({
  providers: [
    TicketSeederService,
    TicketService,
    TicketingContextService,

    InitTicketsUseCase,
    GetTicketUseCase,

    ticketMapperProvider,
    ticketRepoProvider,
  ],
  exports: [
    TicketService,
    TicketingContextService,

    InitTicketsUseCase,
    GetTicketUseCase,

    TicketMapperProvider,
    TicketRepoProvider,
  ],
})
export class TicketModule {}
