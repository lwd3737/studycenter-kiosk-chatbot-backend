import { Inject, Injectable } from '@nestjs/common';
import {
  IMyTicketRepo,
  MyTicketRepoProvider,
} from '../../domain/my-ticket/IMy-ticket.repo';
import { MyTicket } from '../../domain/my-ticket/my-ticket.ar';
import { MemberService } from 'src/modules/member';

@Injectable()
export class MyTicketService {
  constructor(
    @Inject(MyTicketRepoProvider) private myTicketRepo: IMyTicketRepo,
    private memberService: MemberService,
  ) {}

  public async create(myTicket: MyTicket): Promise<void> {
    await this.myTicketRepo.create(myTicket);
  }

  public async update(myTicket: MyTicket): Promise<void> {
    await this.myTicketRepo.update(myTicket);
  }

  public async save(myTicket: MyTicket): Promise<void> {
    const found = await this.findOneById(myTicket.paymentId.value);
    if (found) await this.update(myTicket);
    else await this.create(myTicket);
  }

  public async findOneById(myTicketId: string): Promise<MyTicket | null> {
    return await this.myTicketRepo.findOneById(myTicketId);
  }

  public async findOneByAppUserId(appUserId: string): Promise<MyTicket | null> {
    const foundMember = await this.memberService.findByAppUserId(appUserId);
    if (!foundMember) return null;

    return await this.myTicketRepo.findOneByMemberId(foundMember.id.value);
  }
}
