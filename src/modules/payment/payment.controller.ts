import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('payment')
@Public()
export class PaymentController {
  @Post('webhook')
  async webhook(@Body() event: any) {
    console.log('webhook!!!!');
    console.log(JSON.stringify(event, null, 2));
  }
}
