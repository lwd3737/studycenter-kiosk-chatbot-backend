import { MemberId } from 'src/modules/member/domain/member/member-id';
import {
  VIRTUAL_ACCOUNT_METHOD,
  VirtualAccountPayment,
} from '../../domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';
import { Member } from 'src/modules/member';
import { TicketId } from 'src/modules/ticketing';

export class IVirtualAccountPaymentMapper {
  // static toDomain(
  //   raw: PaymentSchema,
  //   ticketingInfo: { member: Member; ticketId: string; roomId: string },
  // ): VirtualAccountPayment {
  //   return VirtualAccountPayment.createNew({
  //     method: VIRTUAL_ACCOUNT_METHOD,
  //     memberId: ticketingInfo.member.memberId,
  //     order: {
  //       name: raw.orderName,
  //       orderItem: {
  //         ticketId: new TicketId(ticketingInfo.ticketId),
  //       },
  //     },
  //     amount: raw.amount,
  //     status: raw.status,
  //   });
  // }
}
