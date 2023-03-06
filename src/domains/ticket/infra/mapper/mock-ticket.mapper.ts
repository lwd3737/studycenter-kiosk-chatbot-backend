import { Injectable } from '@nestjs/common';
import { combine } from 'src/shared/utils';
import { ITicketMapper } from '../../application/ticket.mapper.interface';
import { TicketCategoryVO } from '../../domain/ticket-category.vo';
import { TicketTimeVO } from '../../domain/ticket-time.vo';
import { TicketEntity } from '../../domain/ticket.entity';
import { GongDreamTicket } from '../gongdream-data.loader';

type MockTicket = GongDreamTicket;

@Injectable()
export class MockTicketMapper implements ITicketMapper {
  toDomain(raw: MockTicket): TicketEntity | null {
    const categoryOrError = TicketCategoryVO.create(raw.category);
    const timeOrError = TicketTimeVO.create({ ...raw.time });

    const ticketPropsOrError = combine(categoryOrError, timeOrError);
    if (ticketPropsOrError.isErr()) {
      return null;
    }

    const [category, time] = ticketPropsOrError.value;

    const ticketOrError = TicketEntity.create({
      name: raw.name,
      category,
      time,
      price: raw.price,
    });

    if (ticketOrError.isErr()) {
      return null;
    }

    return ticketOrError.value;
  }

  toPersistence(domain: TicketEntity) {
    throw new Error('Method not implemented.');
  }
  toDTO(domain: TicketEntity) {
    throw new Error('Method not implemented.');
  }
}
