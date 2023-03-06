export interface IRepo<T> {
  delete(entity: T): Promise<any>;
}
