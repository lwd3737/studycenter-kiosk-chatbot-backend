import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IPGRepo } from 'src/modules/payment/domain/IPG.repo';
import { PGSchema } from './schema/PG.schema';
import { VirtualAccountPayment } from 'src/modules/payment/domain/payment/virtual-account-payment/virtual-account-payment.aggregate-root';
import { RepoError } from 'src/core';
import { MemberId } from 'src/modules/member/domain/member/member-id';
import { Order } from '../../domain/payment/base/order/order.entity';
import { ProductType } from '../../domain/payment/base/order/product.value-object';
import { VirtualAccountPGMapper } from '../mappers/impl/virtual-account-PG.mapper';

export const PGRepoProvider = Symbol('PGRepo');

@Injectable()
export class PGRepo implements IPGRepo {
  private readonly config: {
    bank: string;
    bankCode: string;
    secretKey: string;
    virtualAccountUrl: string;
  };

  constructor() {
    const { PAYMENT_SECRET_KEY, VIRTUAL_ACCOUNT_URL, BANK, BANK_CODE } =
      process.env;
    if (!BANK) throw new RepoError('BANK env viriable is not defined.');
    if (!BANK_CODE)
      throw new RepoError('BANK_CODE env viriable is not defined.');
    if (!PAYMENT_SECRET_KEY)
      throw new RepoError('PAYMENT_SECRET_KEY env viriable is not defined.');
    if (!VIRTUAL_ACCOUNT_URL)
      throw new RepoError('VIRTUAL_ACCOUNT_URL env viriable is not defined.');

    this.config = {
      bank: BANK,
      secretKey: PAYMENT_SECRET_KEY,
      virtualAccountUrl: VIRTUAL_ACCOUNT_URL,
      bankCode: BANK_CODE,
    };
  }

  public async issueVirtualAccount(
    memberId: MemberId,
    virtualAccount: {
      customerName: string;
    },
    order: {
      name: string;
      product: {
        type: ProductType;
        name: string;
        price: number;
      };
    },
  ): Promise<VirtualAccountPayment> {
    const newOrder = Order.create(order);

    let pgSchema: PGSchema;
    try {
      const found = await axios.post<PGSchema>(
        this.config.virtualAccountUrl,
        {
          amount: newOrder.product.price,
          bank: this.config.bankCode,
          customerName: virtualAccount.customerName,
          orderId: newOrder.id.value,
          orderName: newOrder.name,
          validHours: 1,
        },
        {
          headers: {
            Authorization: this.getAuthorizationToken(),
          },
        },
      );

      pgSchema = found.data;
    } catch (error) {
      throw new RepoError(error.response.data.message);
    }

    if (!pgSchema.virtualAccount)
      throw new RepoError('virtualAccount not contains in pgSchema');

    return VirtualAccountPGMapper.toDomain({
      memberId,
      order: newOrder,
      pg: { ...pgSchema, bank: this.config.bank },
    });
  }

  private getAuthorizationToken() {
    const token = Buffer.from(this.config.secretKey + ':').toString('base64');
    return `Basic ${token}`;
  }
}
