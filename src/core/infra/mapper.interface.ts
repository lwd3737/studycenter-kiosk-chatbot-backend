export interface IMapper<T> {
  toDomain(raw: any): T | any;
  toPersistence(domain: T): any;
  toDTO(domain: T): any;
}
