type EntityId = string;

export interface IRepo<T> {
  exists?: (args: any) => Promise<boolean>;
  create?: (entity: T) => Promise<T | null | void>;
  delete?: (entity: T | EntityId) => Promise<void>;
}
