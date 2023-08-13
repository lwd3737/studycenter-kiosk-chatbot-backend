import { BadRequestException } from '@nestjs/common';

export class TicketCategoryParamNotIncludedException extends BadRequestException {
  constructor() {
    const message = 'ticket_category param is not included in dto';
    console.debug(message);

    super(message);
  }
}
