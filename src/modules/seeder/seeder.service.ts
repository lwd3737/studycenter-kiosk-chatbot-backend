import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TicketSeederService } from '../ticketing';
import { RoomsSeatsSeederService } from '../seat-management';
import { MockPaymentCompletionService } from '../payment/application/services/mock-payment-completion.service';
import { MockMemberSeederService } from '../member/application/services/mock-member-seeder.service';
import { CustomConfigService } from '../config';

const ERROR_TYPE = 'SeederService';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    private configService: CustomConfigService,
    private ticketSeederService: TicketSeederService,
    private roomSeatSeederService: RoomsSeatsSeederService,
    private mockMemberSeederService: MockMemberSeederService,
    private mockPaymentCompletionService: MockPaymentCompletionService,
  ) {}

  async onApplicationBootstrap() {
    console.log('Seeder service bootstraped!');

    await Promise.all([
      await this.ticketSeederService.execute(),
      await this.roomSeatSeederService.execute(),
    ]);

    const devMode = this.configService.get<boolean>('devMode');
    if (devMode) {
      const createdMember = await this.mockMemberSeederService.execute();
      await this.mockPaymentCompletionService.execute(createdMember);
    }
  }
}
