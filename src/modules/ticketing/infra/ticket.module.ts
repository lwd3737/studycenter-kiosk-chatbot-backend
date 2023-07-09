import { Module } from '@nestjs/common';
import { TicketMapperProvider } from './mappers/ITicket.mapper';
import { GetAllTicketCollectionsUseCase } from '../application/usecases/get-all-ticket-collection/get-all-ticket-collections.usecase';
import { InitTicketsUseCase } from '../application/usecases/init-tickets/init-tickets.use-case';

import { MockTicketMapper } from './mappers/impl/mock-ticket.mapper';
import { MockTicketRepo } from './persistence/repos/mock-ticket.repo';

import { TicketCollectionService } from '../domain/services/ticket-collection.service';
import { GetTicketsByTypeUseCase } from '../application/usecases/get-tickets-by-type/get-tickets-by-type.use-case';
import { GetTicketUseCase } from '../application/usecases/get-ticket/get-ticket.usecase';
import { TicketSeederService } from '../application/ticket-seeder.service';
import { TicketRepoProvider } from '../domain';

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
    TicketCollectionService,

    InitTicketsUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketsByTypeUseCase,
    GetTicketUseCase,

    ticketMapperProvider,
    ticketRepoProvider,
  ],
  exports: [
    TicketCollectionService,

    InitTicketsUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketsByTypeUseCase,
    GetTicketUseCase,

    TicketMapperProvider,
    TicketRepoProvider,
  ],
})
export class TicketModule {}
