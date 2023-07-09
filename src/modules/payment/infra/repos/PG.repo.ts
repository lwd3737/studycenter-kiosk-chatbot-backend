import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IPGRepo } from 'src/modules/payment/domain/payment/base/IPG.repo';
import { PGSchema } from './schema/PG.schema';
import { VirtualAccountPayment } from 'src/modules/payment/domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';

export const PGRepoProvider = Symbol('PGRepo');

@Injectable()
export class PGRepo implements IPGRepo {
  private readonly secretKey: string;
  private readonly virtualAccountUrl: string;

  constructor() {
    const { PAYMENT_SECRET_KEY, VIRTUAL_ACCOUNT_URL } = process.env;
    if (!PAYMENT_SECRET_KEY)
      throw new Error('PAYMENT_SECRET_KEY env viriable is not defined.');
    if (!VIRTUAL_ACCOUNT_URL)
      throw new Error('VIRTUAL_ACCOUNT_URL env viriable is not defined.');

    this.secretKey = PAYMENT_SECRET_KEY;
    this.virtualAccountUrl = VIRTUAL_ACCOUNT_URL;
  }

  public async issueVirtualAccount(
    virtualAccount: VirtualAccountPayment,
  ): Promise<void> {
    const result = await axios.post<PGSchema>(
      this.virtualAccountUrl,
      {
        amount: virtualAccount.amount,
        orderId: virtualAccount.order.id.value,
        orderName: virtualAccount.order.name,
        bank: virtualAccount.bank,
        customerName: virtualAccount.customerName,
        validHours: 1,
      },
      {
        headers: {
          Authorization: this.getAuthorizationToken(),
        },
      },
    );

    const paymentSchema = result.data;
    virtualAccount.updateStatus(paymentSchema.status);
  }

  private getAuthorizationToken() {
    const token = Buffer.from(this.secretKey + ':').toString('base64');
    return `Basic ${token}`;
  }
}
