import { EventEmitter2 } from '@nestjs/event-emitter';
import { AggregateRoot, EntityId } from '..';
import { IDomainEvent } from './domain-event.interface';

export class DomainEvents {
  private static eventEmitter = new EventEmitter2();
  private static markedAggregates: AggregateRoot<any>[] = [];

  public static registerEvent(
    eventName: string,
    handler: (event: IDomainEvent) => void,
  ): void {
    this.eventEmitter.on(eventName, handler);
  }

  public static waitForEvent(eventName: string): Promise<any[]> {
    return this.eventEmitter.waitFor(eventName);
  }

  public static markAggregateForDisaptch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = this.findMarkedAggregateById(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  public static dispatchEventsForAggregateById(id: EntityId): void {
    const aggregateFound = this.findMarkedAggregateById(id);

    if (aggregateFound) {
      this.dispatchAggregateEvents(aggregateFound);
      aggregateFound.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregateFound);
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>): void {
    aggregate.events.forEach(this.dispatchEvent);
  }

  public static dispatchEvent(event: IDomainEvent): void {
    this.eventEmitter.emit(event.name, event);
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<any>,
  ): void {
    const index = this.markedAggregates.findIndex((marked) =>
      marked.equals(aggregate),
    );
    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateById(
    id: EntityId,
  ): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  public static clearHandlers(): void {
    this.eventEmitter.removeAllListeners();
  }

  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }
}
