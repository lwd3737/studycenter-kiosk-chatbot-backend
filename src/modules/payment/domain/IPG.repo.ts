import { MemberId } from 'src/modules/member/domain/member/member-id';
import { VirtualAccountPayment } from './payment/virtual-account-payment/virtual-account-payment.aggregate-root';

export interface IPGRepo {
  issueVirtualAccount(
    memberId: MemberId,
    virtualAccount: {
      memberId: MemberId;
      customerName: string;
    },
    order: {
      name: string;
      product: {
        type: string;
        name: string;
        price: number;
      };
    },
  ): Promise<VirtualAccountPayment>;
}
