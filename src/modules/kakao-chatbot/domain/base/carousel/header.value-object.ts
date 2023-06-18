import { ok, Result, ValueObject } from 'src/core';
import { Thumbnail } from '../thumbnail/thumbnail.value-object';

export interface CarouselHeaderProps {
  title: string;
  description: string;
  thunbnail: Thumbnail;
}

export class CarouselHeader extends ValueObject<CarouselHeaderProps> {
  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get thunbnail(): Thumbnail {
    return this.props.thunbnail;
  }

  public static create(props: CarouselHeaderProps): Result<CarouselHeader> {
    return ok(new CarouselHeader(props));
  }

  protected constructor(props: CarouselHeaderProps) {
    super(props);
  }
}
