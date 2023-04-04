import { ValueObject } from 'src/core';

export interface ImageTitleProps {
  title: string;
  description?: string;
  imageUrl?: string;
}

export class ImageTitle extends ValueObject<ImageTitleProps> {
  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  public static create(props: ImageTitleProps): ImageTitle {
    return new ImageTitle(props);
  }

  private constructor(props: ImageTitleProps) {
    super(props);
  }
}
