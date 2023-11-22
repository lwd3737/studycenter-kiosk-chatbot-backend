import { CheckInUseCase } from './check-in/usecase';
import { CheckOutUseCase } from './check-out/usecase';
import { GetAllRoomsUseCase } from './get-all-rooms/get-all-rooms.usecase';
import { GetAvailableMyTicketsUseCase } from './get-available-my-tickets/get-available-my-tickets.usecase';
import { GetAvailableSeatsInRoomUseCase } from './get-available-seats-in-room/get-available-seats-in-room.usecase';

export const checkInOutUseCases = [
  GetAvailableMyTicketsUseCase,
  GetAllRoomsUseCase,
  GetAvailableSeatsInRoomUseCase,
  CheckInUseCase,
  CheckOutUseCase,
];
