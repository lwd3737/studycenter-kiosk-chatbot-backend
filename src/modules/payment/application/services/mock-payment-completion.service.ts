import { Injectable } from '@nestjs/common';
import { VirtualAccountPayment } from '../../domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';
import { Member } from 'src/modules/member';
import {
  HOURS_RECHARGE_TICKET_TYPE,
  PERIOD_TICKET_TYPE,
  PeriodTicketType,
  SAME_DAY_TICKET_TYPE,
  Ticket,
  TicketService,
} from 'src/modules/ticketing';
import { ProductType } from '../../domain/payment/base/order/product.value-object';
import { CustomConfigService } from 'src/modules/config';
import { IPaymentRepo } from '../../domain/payment/IPayment.repo';
import { MyTicket, MyTicketService } from 'src/modules/my-page';

const ERROR_TYPE = 'MockPaymentCompletionService';

@Injectable()
export class MockPaymentCompletionService {
  constructor(
    private configService: CustomConfigService,
    private ticketService: TicketService,
    private paymentRepo: IPaymentRepo,
    private myTicketService: MyTicketService,
  ) {}

  public async execute(member: Member) {
    console.log('mock payment completion service executed!');

    const allTickets = await this.ticketService.findAll();
    const preiodTicket = allTickets.find(
      (ticket) => ticket.type === PERIOD_TICKET_TYPE,
    );
    if (!preiodTicket)
      throw new Error(`${ERROR_TYPE}: period ticket not found`);

    const hoursRechargeTicket = allTickets.find(
      (ticket) => ticket.type === HOURS_RECHARGE_TICKET_TYPE,
    );
    if (!hoursRechargeTicket)
      throw new Error(`${ERROR_TYPE}: hours recharge ticket not found`);

    const sameDayTicket = allTickets.find(
      (ticket) => ticket.type === SAME_DAY_TICKET_TYPE,
    );
    if (!sameDayTicket)
      throw new Error(`${ERROR_TYPE}: same day ticket not found`);

    const pg = this.configService.get('pg', { infer: true })!;

    await Promise.all([
      this.createPaymentAndMyTicket({
        member,
        ticket: preiodTicket,
        pg: { bank: pg.bank!, bankCode: pg.bankCode! },
      }),
      this.createPaymentAndMyTicket({
        member,
        ticket: hoursRechargeTicket,
        pg: { bank: pg.bank!, bankCode: pg.bankCode! },
      }),
      this.createPaymentAndMyTicket({
        member,
        ticket: sameDayTicket,
        pg: { bank: pg.bank!, bankCode: pg.bankCode! },
      }),
    ]);
  }

  private async createPaymentAndMyTicket(resources: {
    member: Member;
    ticket: Ticket;
    pg: { bank: string; bankCode: string };
  }) {
    const { member, ticket, pg } = resources;

    const virtualAccountOrError = VirtualAccountPayment.create({
      memberId: member.memberId.value,
      order: {
        name: `[테스트 주문]${ticket.fullTitle}`,
        product: {
          id: ticket.ticketId.value,
          name: ticket.title,
          type: ticket.type as ProductType.TICKET,
          price: ticket.price.value,
        },
      },
      totalAmount: ticket.price.value,
      status: 'DONE',
      secret: 'test_secret',
      bank: pg.bank,
      bankCode: pg.bankCode,
      customerName: member.nickName,
      accountNumber: 'test1234567890',
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (virtualAccountOrError.isErr())
      throw new Error(`${ERROR_TYPE}: virtual account not created`);
    const createdVirtualAccount = await this.paymentRepo.save(
      virtualAccountOrError.value,
    );

    const newMyTicket = MyTicket.new({
      paymentId: createdVirtualAccount.paymentId.value,
      memberId: member.memberId.value,
      ticketId: ticket.ticketId.value,
      type: ticket.type as PeriodTicketType,
      title: `[${ticket.typeDisplay}]${ticket.title}`,
      totalUsageDuration: {
        unit: ticket.usageDuration.unit,
        value: ticket.usageDuration.value,
      },
    });
    if (newMyTicket.isErr())
      throw new Error(`[${ERROR_TYPE}]MyTicket not created`);

    await this.myTicketService.save(newMyTicket.value);
  }
}
