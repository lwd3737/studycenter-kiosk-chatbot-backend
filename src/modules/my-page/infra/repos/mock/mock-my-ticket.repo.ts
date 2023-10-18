import { Injectable } from '@nestjs/common';
import { IMyTicketRepo } from 'src/modules/my-page/domain/my-ticket/IMy-ticket.repo';
import { MyTicket } from 'src/modules/my-page/domain/my-ticket/my-ticket.ar';
import { FixedExpiryUsageDurationType } from 'src/modules/my-page/domain/my-ticket/usage-duration/fixed-expiry-usage-duration.vo';
import { RechargableUsageDurationType } from 'src/modules/my-page/domain/my-ticket/usage-duration/rechargable-usage-duration.vo';
import { MockMyTicketMapper } from '../../mappers/mock/mock-my-ticket.mapper';

export type MockMyTicketSchema = {
  paymentId: string;
  memberId: string;
  ticketId: string;
  inUse: boolean;
  usageDuration: {
    type: FixedExpiryUsageDurationType | RechargableUsageDurationType;
    totalDuration: {
      unit: string;
      value: number;
    };
    startAt: Date | null;
    endAt?: Date | null;
    remainingTime?: number;
  };
};

@Injectable()
export class MockMyTicketRepo implements IMyTicketRepo {
  private storage: MockMyTicketSchema[] = [];

  public async create(myTicket: MyTicket): Promise<void> {
    const raw = MockMyTicketMapper.toPersistence(myTicket);
    this.storage.push(raw);
  }

  public async update(myTicket: MyTicket): Promise<void> {
    const raw = MockMyTicketMapper.toPersistence(myTicket);
    const index = this.storage.findIndex(
      (myTicket) => myTicket.paymentId === raw.paymentId,
    );
    this.storage[index] = raw;
  }

  public async findOneById(myTicketId: string): Promise<MyTicket | null> {
    const raw = this.storage.find(
      (myTicket) => myTicket.paymentId === myTicketId,
    );
    if (!raw) return null;
    return MockMyTicketMapper.toDomain(raw);
  }

  public async findOneByMemberId(memberId: string): Promise<MyTicket | null> {
    const raw = this.storage.find((myTicket) => myTicket.memberId === memberId);
    if (!raw) return null;
    return MockMyTicketMapper.toDomain(raw);
  }
}
