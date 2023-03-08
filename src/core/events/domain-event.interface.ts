import { EntityId } from '..';

export interface IDomainEvent {
  name: string;
  aggregateId?: EntityId;
  occuredAt: Date;
}
