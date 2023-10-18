type ProductProps = {
  id: string;
  type: ProductType;
  name: string;
  price: number;
};
export enum ProductType {
  TICKET = 'TICKET',
}
export type CreateProductProps = ProductProps;

export class Product {
  public static create(props: CreateProductProps): Product {
    return new Product({
      ...props,
    });
  }

  private constructor(private props: ProductProps) {}

  get id(): string {
    return this.props.id;
  }

  get type(): ProductType {
    return this.props.type;
  }

  get name(): string {
    return this.props.name;
  }

  get price(): number {
    return this.props.price;
  }
}
