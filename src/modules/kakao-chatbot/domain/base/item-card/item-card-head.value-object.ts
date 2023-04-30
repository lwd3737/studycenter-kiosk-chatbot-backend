import { ValueObject } from 'src/core';

export interface ItemCardHeadProps {
  title: string;
}

export class ItemCardHead extends ValueObject<ItemCardHeadProps> {
  get title(): string {
    return this.props.title;
  }

  public static create(props: ItemCardHeadProps): ItemCardHead {
    return new ItemCardHead(props);
  }

  private constructor(props: ItemCardHeadProps) {
    super(props);
  }
}
