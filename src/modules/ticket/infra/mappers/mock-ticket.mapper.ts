import { Injectable } from '@nestjs/common';
import { combine } from 'src/core';
import { ITicketMapper } from '../../adpater';
import { ITicketDTO } from '../../application';
import { TicketCategory, Ticket, TicketTime } from '../../domain';
import { MockTicket } from '../persistence';

@Injectable()
export class MockTicketMapper implements ITicketMapper {
  toPersistence(ticket: Ticket): MockTicket {
    const { title, category, time, price } = ticket;

    return {
      title,
      category: category.value,
      time: {
        unit: time.unit,
        value: time.value,
      },
      price,
    };
  }

  toDomain(raw: MockTicket): Ticket {
    const categoryResult = TicketCategory.create(raw.category);
    const timeResult = TicketTime.create({ ...raw.time });

    const ticketPropsResult = combine(categoryResult, timeResult);
    if (ticketPropsResult.isErr()) {
      throw ticketPropsResult.error;
    }

    const [category, time] = ticketPropsResult.value;

    const ticketResult = Ticket.create({
      title: raw.title,
      category,
      time,
      price: raw.price,
    });

    if (ticketResult.isErr()) {
      throw ticketResult.error;
    }

    return ticketResult.value;
  }

  toDTO(ticket: Ticket): ITicketDTO {
    return {
      id: ticket.id.value,
      category: ticket.category.value,
      time: {
        unit: ticket.time.unit,
        value: ticket.time.value,
      },
      price: ticket.price,
    };
  }
}
