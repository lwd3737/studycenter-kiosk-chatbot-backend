import { Injectable } from '@nestjs/common';
import { ITicketMapper } from '../ITicket.mapper';
import { TicketDTO } from '../../../application/dtos/ticket.dto';
import { MockTicket } from '../../persistence';
import {
  TTicketType,
  Ticket,
  TicketFactory,
  TicketType,
} from 'src/modules/ticketing/domain';

@Injectable()
export class MockTicketMapper implements ITicketMapper {
  toPersistence(domain: Ticket): MockTicket {
    return {
      title: domain.title,
      type: domain.type.value as TTicketType,
      isFixedSeat: domain.isFixedSeat,
      time: {
        unit: domain.time.unit,
        value: domain.time.value,
      },
      price: domain.price.value,
      expiration: {
        type: domain.expiration.type,
      },
    };
  }

  toDomain(raw: MockTicket): Ticket {
    const ticketOrError = TicketFactory.createNew({
      type: raw.type,
      props: {
        ...raw,
        price: { value: raw.price },
      },
    });
    if (ticketOrError.isErr()) {
      throw ticketOrError.error;
    }

    return ticketOrError.value;
  }

  toDTO(domain: Ticket): TicketDTO {
    return {
      id: domain.id.value,
      type: domain.type as TicketType,
      isFixedSeat: domain.isFixedSeat,
      time: {
        unit: domain.time.unit,
        value: domain.time.value,
      },
      price: domain.price.value,
      expiration: {
        type: domain.expiration.type,
      },
    };
  }
}
