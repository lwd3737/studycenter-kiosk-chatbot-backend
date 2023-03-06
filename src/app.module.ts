import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './domains/payment';
import { TicketModule } from './domains/ticket';

@Module({
  imports: [TicketModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
