import { Injectable } from '@nestjs/common';
import { SeatManagementSeederService } from '../seat-management';

@Injectable()
export class SeederService {
  constructor(
    private seatManagementSeederService: SeatManagementSeederService,
  ) {}

  public async seed() {
    // TODO: room repo에 비어있을시 실행
    const seedResult = await this.seatManagementSeederService.seed();
    if (seedResult.isErr()) {
      throw seedResult.error;
    }
  }
}
