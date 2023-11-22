import { Injectable } from '@nestjs/common';
import { IMyTicketRepo } from '../../domain/my-ticket/IMy-ticket.repo';
import { MyTicket } from '../../domain/my-ticket/my-ticket.ar';
import { MemberService } from 'src/modules/member';

@Injectable()
export class MyTicketService {
  constructor(
    private myTicketRepo: IMyTicketRepo,
    private memberService: MemberService,
  ) {}

  public async create(myTicket: MyTicket): Promise<MyTicket> {
    return await this.myTicketRepo.create(myTicket);
  }

  public async update(myTicket: MyTicket): Promise<MyTicket> {
    return await this.myTicketRepo.update(myTicket);
  }

  public async save(myTicket: MyTicket): Promise<MyTicket> {
    const found = await this.findOneById(myTicket.paymentId.value);
    if (found) return await this.update(myTicket);
    return await this.create(myTicket);
  }

  public async findOneById(myTicketId: string): Promise<MyTicket | null> {
    return await this.myTicketRepo.findOneById(myTicketId);
  }

  public async findByAppUserId(appUserId: string): Promise<MyTicket[]> {
    const foundMember = await this.memberService.findByAppUserId(appUserId);
    if (!foundMember) return [];
    return await this.myTicketRepo.findByMemberId(foundMember.id.value);
  }

  public async findOneInUse(): Promise<MyTicket | null> {
    const found = await this.myTicketRepo.findOneInUse();
    return found ?? null;
  }
}
