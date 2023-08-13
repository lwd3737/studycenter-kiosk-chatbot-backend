import { BadRequestException } from '@nestjs/common';

export class TicketCategoryParamValueInvalidException extends BadRequestException {
  constructor(value: string) {
    const message = `param value of ticket_category '${value}' is invalid`;
    console.debug(message);

    super(message);
  }
}
