import { ValueObject } from 'src/core';
import { SeatId } from '../seat/seat-id';

export interface SeatIdsProps {
  ids: ReadonlyArray<SeatId>;
}

export class SeatIds extends ValueObject<SeatIdsProps> {
  get ids(): ReadonlyArray<SeatId> {
    return this.props.ids;
  }

  get values(): string[] {
    return this.props.ids.map((id) => id.value);
  }

  get length(): number {
    return this.props.ids.length;
  }

  public add(...idsToAdd: SeatId[]): SeatIds {
    return new SeatIds({
      ids: [...this.props.ids, ...idsToAdd],
    });
  }

  public static create(props?: SeatIdsProps): SeatIds {
    if (props) {
      return new SeatIds(props);
    } else {
      return new SeatIds({ ids: [] });
    }
  }

  private constructor(props: SeatIdsProps) {
    super(props);
  }
}
