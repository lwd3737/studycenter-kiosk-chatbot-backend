import { err, ok, Result, ValueObject } from 'src/core';
import { ThumbnailError, ThumbnailErrors } from './errors';

export interface ThumbnailProps {
  imageUrl: string;
  //link?: Link
  fixedRatio?: boolean;
  width?: number;
  height?: number;
}

export class Thumbnail extends ValueObject<ThumbnailProps> {
  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get fixedRatio(): boolean | undefined {
    return this.props.fixedRatio;
  }

  get width(): number | undefined {
    return this.props.width;
  }

  get height(): number | undefined {
    return this.props.height;
  }

  public static create(
    props: ThumbnailProps,
  ): Result<Thumbnail, ThumbnailError> {
    const validationResult = this.validate(props);
    if (validationResult.isErr()) {
      return err(validationResult.error);
    }

    return ok(new Thumbnail(props));
  }

  private static validate(props: ThumbnailProps): Result<null, ThumbnailError> {
    if (this.isWidthOrHeightNotIncludedWhenFixedRatioIncluded({ ...props })) {
      return err(
        new ThumbnailErrors.WidthOrHeightNotIncludedWhenFixRatioIncludedError(),
      );
    }

    return ok(null);
  }

  private static isWidthOrHeightNotIncludedWhenFixedRatioIncluded(
    props: Omit<ThumbnailProps, 'imageUrl'>,
  ): boolean {
    const { fixedRatio, width, height } = props;

    if (fixedRatio) {
      return !!width && !!height;
    }

    return false;
  }

  protected constructor(props: ThumbnailProps) {
    super(props);
  }
}
