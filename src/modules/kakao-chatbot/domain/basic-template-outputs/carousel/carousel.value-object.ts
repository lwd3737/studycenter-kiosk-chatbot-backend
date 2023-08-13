import { ValueObject } from 'src/core';
import { CarouselHeader } from './header.value-object';

export interface CarouselProps<T, P> {
  type: T;
  header?: CarouselHeader;
  items: P[];
}
type CarouselItem = Record<string, any>;

export abstract class Carousel<
  T extends string = string,
  P extends CarouselItem = CarouselItem,
> extends ValueObject<CarouselProps<T, P>> {
  get type(): T {
    return this.props.type;
  }

  get header(): CarouselHeader | undefined {
    return this.props.header;
  }

  get items(): P[] {
    return this.props.items;
  }

  protected constructor(props: CarouselProps<T, P>) {
    super(props);
  }
}
