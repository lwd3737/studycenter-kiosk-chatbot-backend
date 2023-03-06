import { IResponseDTO } from 'src/core/application';
import { ITicketDTO } from './ticket.dto.interface';

export type IGetTicketsByCategoryDTO = IResponseDTO<{
  tickets: ITicketDTO[];
}>;
