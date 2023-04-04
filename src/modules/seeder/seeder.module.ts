import { Module } from '@nestjs/common';
import { SeatManagementModule } from '../seat-management';
import { SeederService } from './seeder.service';

@Module({
  imports: [SeatManagementModule],
  providers: [SeederService],
})
export class SeederModule {}
