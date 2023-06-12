import { Module } from '@nestjs/common';
import { TicketMapperProvider } from './mappers/ITicket.mapper';
import { GetAllTicketCollectionsUseCase } from '../application/usecases/get-all-ticket-collection/get-all-ticket-collections.use-case';
import { InitTicketsUseCase } from '../application/usecases/init-tickets/init-tickets.use-case';

import { MockTicketMapper } from './mappers/impl/mock-ticket.mapper';
import { MockTicketRepo } from './persistence/repos/mock-ticket.repo';

import { TicketCollectionService } from '../domain/services/ticket-collection.service';
import { GetTicketsByTypeUseCase } from '../application/usecases/get-tickets-by-type/get-tickets-by-type.use-case';
import { GetTicketByTimeUseCase } from '../application/usecases/get-ticket-by-time/get-ticket-by-time.use-case';
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
    GetTicketByTimeUseCase,

    ticketMapperProvider,
    ticketRepoProvider,
  ],
  exports: [
    TicketCollectionService,

    InitTicketsUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketsByTypeUseCase,
    GetTicketByTimeUseCase,

    TicketMapperProvider,
    TicketRepoProvider,
  ],
})
export class TicketModule {}
