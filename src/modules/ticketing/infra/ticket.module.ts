import { Module } from '@nestjs/common';
import { TicketMapperProvider } from './mappers/ticket.mapper.interface';
import { GetAllTicketCollectionsUseCase } from '../application/use-cases/get-all-ticket-collection/get-all-ticket-collections.use-case';
import { InitTicketsUseCase } from '../application/use-cases/init-tickets/init-tickets.use-case';

import { MockTicketMapper } from './mappers/impl/mock-ticket.mapper';
import { MockTicketRepo } from './persistence/repos/mock-ticket.repo';

import { TicketCollectionService } from '../domain/services/ticket-collection.service';
import { GetTicketsByCategoryUseCase } from '../application/use-cases/get-tickets-by-category/get-tickets-by-category.use-case';
import { GetTicketByTimeUseCase } from '../application/use-cases/get-ticket-by-time/get-ticket-by-time.use-case';
import { TicketRepoProvider } from '../domain/ticket/ticket.repo.interface';
import { TicketSeederService } from '../application/ticket-seeder.service';

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
    GetTicketsByCategoryUseCase,
    GetTicketByTimeUseCase,

    ticketMapperProvider,
    ticketRepoProvider,
  ],
  exports: [
    TicketCollectionService,

    InitTicketsUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketsByCategoryUseCase,
    GetTicketByTimeUseCase,

    TicketMapperProvider,
    TicketRepoProvider,
  ],
})
export class TicketModule {}
