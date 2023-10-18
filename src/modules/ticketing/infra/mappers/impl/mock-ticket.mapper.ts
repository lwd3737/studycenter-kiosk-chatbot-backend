import { Injectable } from '@nestjs/common';
import { ITicketMapper } from '../ITicket.mapper';
import { TicketDTO, TicketTypeDTO } from '../../../application/dtos/ticket.dto';
import { MockTicket } from '../../persistence';
import {
  TicketType,
  Ticket,
  TicketFactory,
} from 'src/modules/ticketing/domain';

@Injectable()
export class MockTicketMapper implements ITicketMapper {
  toPersistence(domain: Ticket): MockTicket {
    return {
      id: domain.id.value,
      title: domain.title,
      type: domain.type as TicketType,
      fixedSeat: domain.fixedSeat,
      usageDuration: {
        unit: domain.usageDuration.unit,
        value: domain.usageDuration.value,
      },
      price: domain.price.value,
    };
  }

  toDomain(raw: MockTicket): Ticket {
    const ticketOrError = TicketFactory.from(raw.type, { ...raw }, raw.id);
    if (ticketOrError.isErr()) {
      throw ticketOrError.error;
    }

    return ticketOrError.value;
  }

  toDTO(domain: Ticket): TicketDTO {
    return {
      id: domain.id.value,
      type: domain.type as TicketTypeDTO,
      isFixedSeat: domain.fixedSeat,
      time: {
        unit: domain.usageDuration.unit,
        value: domain.usageDuration.value,
      },
      price: domain.price.value,
    };
  }
}
