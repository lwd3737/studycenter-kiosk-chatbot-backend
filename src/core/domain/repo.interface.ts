type EntityId = string;

export interface IRepo<T> {
  exists?: (args: any) => Promise<boolean>;
  create?: (entity: T) => Promise<void>;
  delete?: (entity: T | EntityId) => Promise<void>;
}
