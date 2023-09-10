import { Module } from '@nestjs/common';
import { RoomRepoProvider } from './domain/room/room.repo.interface';
import { SeatRepoProvider } from './domain/seat/seat.repo.interface';
import { MockRoomMapper } from './infra/mappers/impl/mock-room.mapper';
import { MockSeatMapper } from './infra/mappers/impl/mock-seat.mapper';
import { RoomMapperProvider } from './infra/mappers/room.mapper.interace';
import { SeatMapperProvider } from './infra/mappers/seat.mapper.interface';
import { MockRoomRepo } from './infra/repos/mocks/mock-room.repo';
import { MockSeatRepo } from './infra/repos/mocks/mock-seat.repo';
import { RoomsSeatsSeederService } from './infra/seads/rooms-seats-seeder.service';
import { SeatService } from './services/seat.service';

@Module({
  providers: [
    RoomsSeatsSeederService,
    SeatService,

    {
      provide: RoomMapperProvider,
      useClass: MockRoomMapper,
    },
    {
      provide: SeatMapperProvider,
      useClass: MockSeatMapper,
    },

    {
      provide: RoomRepoProvider,
      useClass: MockRoomRepo,
    },
    {
      provide: SeatRepoProvider,
      useClass: MockSeatRepo,
    },
  ],
  exports: [RoomsSeatsSeederService, SeatService],
})
export class SeatManagementModule {}
