import { Controller, Get, Render } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  @Get()
  @Render('payment/index')
  index() {
    return {
      price: '10,000',
    };
  }
}
