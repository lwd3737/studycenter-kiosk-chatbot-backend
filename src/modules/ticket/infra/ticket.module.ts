import { Module } from '@nestjs/common';
import { TicketMapperProvider } from '../adpater/ticket.mapper.interface';
import { GetAllTicketCollectionsUseCase } from '../application/use-cases/get-all-ticket-collections.use-case';
import { InitTicketUseCase } from '../application/use-cases/init-ticket.use-case';
import { TicketRepoProvider } from '../domain/ticket.repo.interface';

import { MockTicketMapper } from './mappers/mock-ticket.mapper';
import { InMemoryTicketRepo } from './persistence/repos/in-memory-ticket.repo';

import { TicketCollectionService } from '../domain/services/ticket-collection.service';
import { TicketInitService } from '../domain/services/ticket-init.service';
import { GetTicketsByCategoryUseCase } from '../application/use-cases/get-tickets-by-category.use-case';

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
    TicketInitService,
    TicketCollectionService,
    InitTicketUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketsByCategoryUseCase,
    ticketMapperProvider,
    ticketRepoProvider,
  ],
  exports: [
    TicketMapperProvider,
    TicketRepoProvider,
    TicketInitService,
    TicketCollectionService,
    InitTicketUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketsByCategoryUseCase,
  ],
})
export class TicketModule {}
