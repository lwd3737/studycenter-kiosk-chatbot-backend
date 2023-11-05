import { Global, Module } from '@nestjs/common';
import { TicketModule } from '../ticketing';
import { SeatManagementModule } from '../seat-management';
import { PaymentModule } from '../payment/payment.module';
import { SeederService } from './seeder.service';
import { MemberModule } from '../member';

@Global()
@Module({
  imports: [TicketModule, SeatManagementModule, PaymentModule, MemberModule],
  providers: [SeederService],
})
export class SeederModule {}
