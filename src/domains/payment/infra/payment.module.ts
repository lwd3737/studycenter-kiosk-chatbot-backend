import { Module } from '@nestjs/common';
import { PaymentController } from '../adapter/payment.controller';

@Module({
  controllers: [PaymentController],
})
export class PaymentModule {}
