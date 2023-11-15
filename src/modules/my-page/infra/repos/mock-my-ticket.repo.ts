import { Injectable } from '@nestjs/common';
import { IMyTicketRepo } from 'src/modules/my-page/domain/my-ticket/IMy-ticket.repo';
import { MyTicket } from 'src/modules/my-page/domain/my-ticket/my-ticket.ar';
import { FixedExpiryUsageDurationType } from 'src/modules/my-page/domain/my-ticket/usage-duration/fixed-expiry-usage-duration.vo';
import { RechargableUsageDurationType } from 'src/modules/my-page/domain/my-ticket/usage-duration/rechargable-usage-duration.vo';
import { MockMyTicketMapper } from '../mappers/mock/mock-my-ticket.mapper';

export type MockMyTicketSchema = {
  id: string;
  paymentId: string;
  memberId: string;
  ticketId: string;
  title: string;
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
  seatIdInUse: string | null;
};

const ERROR_TYPE = 'MockMyTicketRepo';

@Injectable()
export class MockMyTicketRepo extends IMyTicketRepo {
  private storage: MockMyTicketSchema[] = [];

  public async create(myTicket: MyTicket): Promise<MyTicket> {
    const raw = MockMyTicketMapper.toPersistence(myTicket);
    this.storage.push(raw);

    const created = await this.findOneById(myTicket.id.value);
    if (!created) throw new Error(`[${ERROR_TYPE}]MyTicket not created`);

    return created;
  }

  public async update(myTicket: MyTicket): Promise<MyTicket> {
    const raw = MockMyTicketMapper.toPersistence(myTicket);
    const index = this.storage.findIndex((myTicket) => myTicket.id === raw.id);
    this.storage[index] = raw;

    const updated = await this.findOneById(myTicket.id.value);
    if (!updated) throw new Error(`[${ERROR_TYPE}]MyTicket not updated`);
    return updated;
  }

  public async findOneById(myTicketId: string): Promise<MyTicket | null> {
    const raw = this.storage.find((raw) => raw.id === myTicketId);
    if (!raw) return null;
    return MockMyTicketMapper.toDomain(raw);
  }

  public async findByMemberId(memberId: string) {
    const raw = this.storage.filter(
      (myTicket) => myTicket.memberId === memberId,
    );
    return raw.map((r) => MockMyTicketMapper.toDomain(r));
  }
}
