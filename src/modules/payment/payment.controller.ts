import { Controller, Get, Post, Render } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  // @Get()
  // @Render('payment/index')
  // index() {
  //   return {
  //     price: '10,000',
  //   };
  // }

  @Get('virtual_account')
  async issueVirtualAccount() {}
}
