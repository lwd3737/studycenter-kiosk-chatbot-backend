import { Controller, Post } from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { CheckInOutService } from 'src/modules/my-page';

// TODO: public 제거
@Public()
@Controller('check-in-out')
export class KakaoChatbotCheckinOutController {
  constructor(private checkInOutService: CheckInOutService) {}

  @Post('available-my-tickets')
  async getAvailableMyTickets() {}

  @Post('check-in')
  async checkIn() {}
}
