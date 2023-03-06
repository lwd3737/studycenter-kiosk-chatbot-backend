import { Controller, Post } from '@nestjs/common';
import { IGetTicketsByCategoryDTO } from '../application/dto/ticket-response.dto.interface';
import { TicketUseCases } from '../application/ticket.use-cases';

@Controller('tickets')
export class TicketController {
  constructor(private ticketUseCases: TicketUseCases) {}

  @Post()
  async getTicketsByCategory(): Promise<IGetTicketsByCategoryDTO> {
    try {
      const result = await this.ticketUseCases.getTicketsByCategory();

      if (result.isErr()) {
        const error = result.error;

        return {};
      }
    } catch (error) {}

    return {
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: "hello I'm Ryan",
            },
          },
        ],
      },
    };
  }
}
