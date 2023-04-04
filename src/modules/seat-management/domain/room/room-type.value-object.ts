import { err, ok, Result, ValueObject } from 'src/core';
import { RoomErrors } from './room.error';

export enum RoomTypeEnum {
  READING_ROOM = 'READING_ROOM',
  CAFE = 'CAFE',
  VIP_ROOM = 'VIP_ROOM',
}

export interface RoomTypeProps {
  value: RoomTypeEnum;
}

export class RoomType extends ValueObject<RoomTypeProps> {
  static Values = [
    RoomTypeEnum.READING_ROOM,
    RoomTypeEnum.CAFE,
    RoomTypeEnum.VIP_ROOM,
  ] as const;

  get value(): RoomTypeEnum {
    return this.props.value;
  }

  public static create(props: {
    value: string;
  }): Result<RoomType, RoomErrors.RoomTypeInValidError> {
    if (this.isValid(props.value) === false) {
      return err(new RoomErrors.RoomTypeInValidError(props.value));
    }

    const enumValue = RoomTypeEnum[props.value as keyof typeof RoomTypeEnum];

    return ok(new RoomType({ value: enumValue }));
  }

  public static isValid(value: string): value is RoomTypeEnum {
    const values = this.Values as unknown as string[];

    return values.includes(value);
  }

  private constructor(props: RoomTypeProps) {
    super(props);
  }
}
