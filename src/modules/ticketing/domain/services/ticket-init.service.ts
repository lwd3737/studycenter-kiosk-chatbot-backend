import { Injectable } from '@nestjs/common';
import { combine, DomainError, err, Result } from 'src/core';
import {
  TicketCategoryEnum,
  TicketCategory,
} from '../ticket/ticket-category.value-object';
import {
  TicketTime,
  TicketTimeUnitEnum,
} from '../ticket/ticket-time.value-object';
import { Ticket } from '../ticket/ticket.aggregate-root';

type DefaultTicket = {
  title: string;
  category: TicketCategoryEnum;
  time: {
    unit: TicketTimeUnitEnum;
    value: number;
  };
  price: number;
};

@Injectable()
export class TicketInitService {
  private readonly DEFAULT_TICKETS: DefaultTicket[] = [
    {
      title: '15일권',
      category: TicketCategoryEnum.PERIOD,
      time: {
        unit: TicketTimeUnitEnum.DAYS,
        value: 15,
      },
      price: 80000,
    },
    {
      title: '30일권',
      category: TicketCategoryEnum.PERIOD,
      time: {
        unit: TicketTimeUnitEnum.DAYS,
        value: 30,
      },
      price: 130000,
    },
    {
      title: '50시간권',
      category: TicketCategoryEnum.HOURS_RECHARGE,
      time: {
        unit: TicketTimeUnitEnum.HOURS,
        value: 50,
      },

      price: 65000,
    },
    {
      title: '100시간권',
      category: TicketCategoryEnum.HOURS_RECHARGE,
      time: {
        unit: TicketTimeUnitEnum.HOURS,
        value: 100,
      },
      price: 650000,
    },
    {
      title: '1시간권',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TicketTimeUnitEnum.HOURS,
        value: 1,
      },
      price: 2000,
    },
    {
      title: '2시간권',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TicketTimeUnitEnum.HOURS,
        value: 2,
      },
      price: 3000,
    },
    {
      title: '4시간권',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TicketTimeUnitEnum.HOURS,
        value: 4,
      },
      price: 5000,
    },
    {
      title: '6시간권',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TicketTimeUnitEnum.HOURS,
        value: 6,
      },
      price: 6000,
    },
    {
      title: '9시간권',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TicketTimeUnitEnum.HOURS,
        value: 9,
      },
      price: 8000,
    },
    {
      title: '12시간권',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TicketTimeUnitEnum.HOURS,
        value: 12,
      },
      price: 10000,
    },
  ];

  initToDefault(): Result<Ticket[], DomainError> {
    const ticketResultCollection: Result<Ticket, DomainError>[] = [];

    for (const ticket of this.DEFAULT_TICKETS) {
      const categoryResult = TicketCategory.create(ticket.category);
      if (categoryResult.isErr()) {
        return err(categoryResult.error);
      }

      const timeResult = TicketTime.create({
        unit: ticket.time.unit,
        value: ticket.time.value,
      });
      if (timeResult.isErr()) {
        return err(timeResult.error);
      }

      const ticketResult = Ticket.create({
        title: ticket.title,
        category: categoryResult.value,
        time: timeResult.value,
        price: ticket.price,
      });

      ticketResultCollection.push(ticketResult);
    }

    return combine(...ticketResultCollection);
  }
}
