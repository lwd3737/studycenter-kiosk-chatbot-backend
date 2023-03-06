import { AnyObject } from 'src/shared/types';
import { EntityId } from './entity-id';

export abstract class Entity<T extends AnyObject> {
  protected _id: EntityId;
  protected props: T;

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
