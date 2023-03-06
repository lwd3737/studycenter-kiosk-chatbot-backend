import { Module } from '@nestjs/common';
import { TicketController } from '../adpater/ticket.controller';
import { TicketMapperToken } from '../application/ticket.mapper.interface';
import { TicketUseCases } from '../application/ticket.use-cases';
import { TicketRepoToken } from '../domain/ticket.repo.interface';
import { MockTicketMapper } from '../adpater/mock-ticket.mapper';
import { MockTicketRepo } from '../adpater/mock-ticket.repo';
import {
  GongDreamTicketsToken,
  loadGongDreamTickets,
} from './gongdream-data.loader';

@Module({
  controllers: [TicketController],
  providers: [
    TicketUseCases,
    {
      provide: GongDreamTicketsToken,
      useValue: loadGongDreamTickets(),
    },
    {
      provide: TicketMapperToken,
      useClass: MockTicketMapper,
    },
    {
      provide: TicketRepoToken,
      useClass: MockTicketRepo,
    },
  ],
})
export class TicketModule {}
