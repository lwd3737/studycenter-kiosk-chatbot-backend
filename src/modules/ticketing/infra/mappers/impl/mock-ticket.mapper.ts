import { Injectable } from '@nestjs/common';
import { ITicketMapper } from '../ticket.mapper.interface';
import { TicketDTO } from '../../../application/dtos/ticket.dto';
import { Ticket } from '../../../domain/ticket/ticket.aggregate-root';
import { MockTicket } from '../../persistence';

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
    const ticketOrError = Ticket.create(raw);

    if (ticketOrError.isErr()) {
      throw ticketOrError.error;
    }

    return ticketOrError.value;
  }

  toDTO(ticket: Ticket): TicketDTO {
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
