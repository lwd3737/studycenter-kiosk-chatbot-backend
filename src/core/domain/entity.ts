import { AnyObject } from 'src/shared/types';
import { EntityID } from './entity-id';

export abstract class Entity<T extends AnyObject> {
  protected _id: EntityID;
  public props: T;

  constructor(props: T, id?: string) {
    this.props = props;

    if (id) {
      this._id = new EntityID(id);
    }
  }

  get id(): string {
    return this._id.value;
  }
}
