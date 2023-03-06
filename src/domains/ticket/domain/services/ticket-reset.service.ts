import { Injectable } from '@nestjs/common';
import { combine, DomainError, err, Result } from 'src/core';
import {
  TicketCategoryEnum,
  TicketCategory,
} from '../ticket-category.value-object';
import { TTicketTimeUnit, TicketTime } from '../ticket-time.value-object';
import { Ticket } from '../ticket.aggregate-root';

type DefaultTicket = {
  title: string;
  category: TicketCategoryEnum;
  time: {
    unit: TTicketTimeUnit;
    value: number;
  };
  price: number;
};

@Injectable()
export class TicketResetService {
  private readonly DEFAULT_TICKETS: DefaultTicket[] = [
    {
      title: '15일(고정석)',
      category: TicketCategoryEnum.PERIOD,
      time: {
        unit: TTicketTimeUnit.DAYS,
        value: 15,
      },
      price: 80000,
    },
    {
      title: '30일(고정석)',
      category: TicketCategoryEnum.PERIOD,
      time: {
        unit: TTicketTimeUnit.DAYS,
        value: 30,
      },
      price: 130000,
    },
    {
      title: '50시간(자유석)',
      category: TicketCategoryEnum.HOURS_RECHARGE,
      time: {
        unit: TTicketTimeUnit.HOURS,
        value: 50,
      },

      price: 65000,
    },
    {
      title: '100시간(자유석)',
      category: TicketCategoryEnum.HOURS_RECHARGE,
      time: {
        unit: TTicketTimeUnit.HOURS,
        value: 100,
      },
      price: 650000,
    },
    {
      title: '1시간',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TTicketTimeUnit.HOURS,
        value: 1,
      },
      price: 2000,
    },
    {
      title: '2시간',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TTicketTimeUnit.HOURS,
        value: 2,
      },
      price: 3000,
    },
    {
      title: '4시간',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TTicketTimeUnit.HOURS,
        value: 4,
      },
      price: 5000,
    },
    {
      title: '6시간',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TTicketTimeUnit.HOURS,
        value: 6,
      },
      price: 6000,
    },
    {
      title: '9시간',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TTicketTimeUnit.HOURS,
        value: 9,
      },
      price: 8000,
    },
    {
      title: '12시간',
      category: TicketCategoryEnum.SAME_DAY,
      time: {
        unit: TTicketTimeUnit.HOURS,
        value: 12,
      },
      price: 10000,
    },
  ];

  reset(): Result<Ticket[], DomainError> {
    const ticketResults: Result<Ticket, DomainError>[] = [];

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

      ticketResults.push(ticketResult);
    }

    return combine(...ticketResults);
  }
}
