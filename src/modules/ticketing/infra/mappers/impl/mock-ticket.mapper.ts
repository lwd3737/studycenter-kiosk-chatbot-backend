import { Injectable } from '@nestjs/common';
import { ITicketMapper } from '../ITicket.mapper';
import { TicketDTO, TicketTypeDTO } from '../../../application/dtos/ticket.dto';
import { MockTicket } from '../../persistence';
import {
  TicketTypeKind,
  Ticket,
  TicketFactory,
} from 'src/modules/ticketing/domain';

@Injectable()
export class MockTicketMapper implements ITicketMapper {
  toPersistence(domain: Ticket): MockTicket {
    return {
      id: domain.id.value,
      title: domain.title,
      type: domain.type.value as TicketTypeKind,
      isFixedSeat: domain.isFixedSeat,
      time: {
        unit: domain.time.unit,
        value: domain.time.value,
      },
      price: domain.price.value,
      expiration: {
        type: domain.expirationType.value,
      },
    };
  }

  toDomain(raw: MockTicket): Ticket {
    const ticketOrError = TicketFactory.from(
      raw.type,
      {
        ...raw,
        price: { value: raw.price },
      },
      raw.id,
    );
    if (ticketOrError.isErr()) {
      throw ticketOrError.error;
    }

    return ticketOrError.value;
  }

  toDTO(domain: Ticket): TicketDTO {
    return {
      id: domain.id.value,
      type: domain.type.value as TicketTypeDTO,
      isFixedSeat: domain.isFixedSeat,
      time: {
        unit: domain.time.unit,
        value: domain.time.value,
      },
      price: domain.price.value,
      expirationType: domain.expirationType.value,
    };
  }
}
