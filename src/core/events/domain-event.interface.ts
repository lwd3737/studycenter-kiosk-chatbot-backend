import { EntityId } from '..';

export interface IDomainEvent {
  name: symbol;
  createdAt: Date;
  getAggregateId(): EntityId;
}
