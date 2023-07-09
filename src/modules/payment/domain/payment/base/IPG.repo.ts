import { VirtualAccountPayment } from '../virtual-account-payment/virtual-account-payment.aggregate-root';

export interface IPGRepo {
  issueVirtualAccount(virtualAccount: VirtualAccountPayment): Promise<void>;
}
