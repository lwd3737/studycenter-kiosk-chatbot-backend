import { IDomainEvent } from '../events';
import { DomainEvents } from '../events/domain-events';
import { Entity } from './entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _events: IDomainEvent[];

  get events(): IDomainEvent[] {
    return this._events;
  }

  public addEvent(event: IDomainEvent): void {
    this._events.push(event);

    DomainEvents.markAggregateForDisaptch(this);
    this.logEventAdded;
  }

  public clearEvents(): void {
    this._events = [];
  }

  private logEventAdded(event: IDomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(event);

    if (thisClass && domainEventClass) {
      console.info(
        `[Domain Event Created]:`,
        thisClass.constructor.name,
        '==>',
        domainEventClass.constructor.name,
      );
    }
  }
}
