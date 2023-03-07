import { BadRequestException } from '@nestjs/common';

export class ValidTicketCategoryNotIncludedException extends BadRequestException {
  constructor(category?: string) {
    const message = `Ticket category '${category}' is not included in params`;
    console.debug(message);
    super(message);
  }
}
