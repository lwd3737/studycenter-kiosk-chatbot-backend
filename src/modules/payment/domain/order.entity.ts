import { Entity, EntityId } from 'src/core';
import { OrderId } from './order-id';

interface Props {
  name: string;
  product: Product;
}

type Product = {
  type: 'ticket';
  id: string;
};

export type CreateOrderProps = Props;

export class Order extends Entity<Props> {
  get id(): EntityId {
    return this._id;
  }

  get orderId(): OrderId {
    return new OrderId(this.id.value);
  }

  get name(): string {
    return this.props.name;
  }

  get product(): Product {
    return this.props.product;
  }

  public static create(props: Props, id?: string) {
    return new Order(props, id);
  }

  private constructor(props: Props, id?: string) {
    super(props, id);
  }
}
