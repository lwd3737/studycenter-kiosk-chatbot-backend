import { Result } from 'src/core';

export interface IMapper<T> {
  toDomain?: (raw: any) => T;
  toPersistence?: (domain: T) => any;
  toDTO?: (domain: T) => any;
}
