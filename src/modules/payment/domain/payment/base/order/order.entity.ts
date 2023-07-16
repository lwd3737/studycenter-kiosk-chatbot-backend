import { Entity, EntityId } from 'src/core';
import { OrderId } from './order-id';
import { CreateProductProps, Product } from './product.value-object';

interface Props {
  name: string;
  product: Product;
}

export type CreateOrderProps = Pick<Props, 'name'> & {
  product: CreateProductProps;
};

export class Order extends Entity<Props> {
  public static create(props: CreateOrderProps, id?: string) {
    return new Order({ ...props, product: Product.create(props.product) }, id);
  }

  private constructor(props: Props, id?: string) {
    super(props, id);
  }

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
}
