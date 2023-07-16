type ProductProps = {
  type: ProductType;
  name: string;
  price: number;
};
export enum ProductType {
  ticket = 'ticket',
}
export type CreateProductProps = ProductProps;

export class Product {
  public static create(props: CreateProductProps): Product {
    return new Product({
      ...props,
    });
  }

  private constructor(private props: ProductProps) {}

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
