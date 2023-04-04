import { Module } from '@nestjs/common';
import { TicketMapperProvider } from '../adpater/ticket.mapper.interface';
import { GetAllTicketCollectionsUseCase } from '../application/use-cases/get-all-ticket-collections.use-case';
import { InitTicketUseCase } from '../application/use-cases/init-ticket.use-case';

import { MockTicketMapper } from './mappers/mock-ticket.mapper';
import { MockTicketRepo } from './persistence/repos/mock-ticket.repo';

import { TicketCollectionService } from '../domain/services/ticket-collection.service';
import { TicketInitService } from '../domain/services/ticket-init.service';
import { GetTicketsByCategoryUseCase } from '../application/use-cases/get-tickets-by-category.use-case';
import { GetTicketByTimeUseCase } from '../application/use-cases/get-ticket-by-time.use-case';
import { TicketRepoProvider } from '../domain/ticket/ticket.repo.interface';

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
    TicketInitService,
    TicketCollectionService,

    InitTicketUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketsByCategoryUseCase,
    GetTicketByTimeUseCase,

    ticketMapperProvider,
    ticketRepoProvider,
  ],
  exports: [
    TicketInitService,
    TicketCollectionService,

    InitTicketUseCase,
    GetAllTicketCollectionsUseCase,
    GetTicketsByCategoryUseCase,
    GetTicketByTimeUseCase,

    TicketMapperProvider,
    TicketRepoProvider,
  ],
})
export class TicketModule {}
