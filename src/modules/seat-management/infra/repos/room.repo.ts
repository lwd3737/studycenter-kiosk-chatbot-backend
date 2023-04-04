import { Injectable } from '@nestjs/common';
import { Room } from '../../domain/room/room.aggregate-root';

@Injectable()
export class RoomRepo implements RoomRepo {
  init(): Promise<Room[]> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<Room[]> {
    throw new Error('Method not implemented.');
  }
  // exists?: ((args: any) => Promise<boolean>) | undefined;
  // create?: ((entity: Room) => Promise<void>) | undefined;
  // delete?: ((entity: string | Room) => Promise<void>) | undefined;
}
