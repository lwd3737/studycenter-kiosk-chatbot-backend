import { Module } from '@nestjs/common';
import { TicketMapperProvider } from '../adpater/ticket.mapper.interface';
import { GetAllTicketCollectionsUseCase } from '../application/use-cases/get-all-ticket-collections.use-case';
import { InitTicketsUseCase } from '../application/use-cases/init-tickets.use-case';
import { TicketRepoProvider } from '../domain/ticket.repo.interface';

import { MockTicketMapper } from './mappers/mock-ticket.mapper';
import { InMemoryTicketRepo } from './persistence/repos/in-memory-ticket.repo';
import { TicketResetService } from '../domain/services';
import { GetTicketCollectionByCategoryUseCase } from '../application';

const ticketMapperProvider = {
  provide: TicketMapperProvider,
  useClass: MockTicketMapper,
};

const ticketRepoProvider = {
  provide: TicketRepoProvider,
  useClass: InMemoryTicketRepo,
};

@Module({
  providers: [
    ticketMapperProvider,
    ticketRepoProvider,
    TicketResetService,
    InitTicketsUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketCollectionByCategoryUseCase,
  ],
  exports: [
    TicketMapperProvider,
    TicketRepoProvider,
    TicketResetService,
    InitTicketsUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketCollectionByCategoryUseCase,
  ],
})
export class TicketModule {}
