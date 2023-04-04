import { EntityId } from './entity-id';

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class Entity<T = {}> {
  protected _id: EntityId;
  protected props: T;

  // TODO: 리팩터링 후 id 자동 생성 로직 없애기
  constructor(props: T, id?: string) {
    this._id = new EntityId(id);
    this.props = props;
  }

  get id(): EntityId {
    return this._id;
  }

  public equals(entity: Entity<T>): boolean {
    if (this === entity) return true;
    return this._id.equals(entity.id);
  }
}
