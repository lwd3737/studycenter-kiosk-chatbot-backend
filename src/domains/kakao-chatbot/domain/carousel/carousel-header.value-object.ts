import { ok, Result, ValueObject } from 'src/core';

export interface CarouselHeaderProps {
  title: string;
  description: string;
  thunbnail: string;
}

export class CarouselHeader extends ValueObject<CarouselHeaderProps> {
  protected constructor(props: CarouselHeaderProps) {
    super(props);
  }

  public static create(props: CarouselHeaderProps): Result<CarouselHeader> {
    return ok(new CarouselHeader(props));
  }
}
