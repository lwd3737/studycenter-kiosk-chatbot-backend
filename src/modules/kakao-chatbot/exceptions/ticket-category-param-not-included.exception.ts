import { BadRequestException } from '@nestjs/common';

export class TicketCategoryParamNotIncludedException extends BadRequestException {
  constructor() {
    const message = 'Ticket category param is not included in dto';

    super(message);
  }
}
