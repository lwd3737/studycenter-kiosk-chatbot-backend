import { AggregateRoot, EntityId } from 'src/core/domain';

export interface PurchaseHistoryProps {
  user: EntityId;
  ticket: EntityId;
  seat: EntityId;
}

export class PurchaseHistory extends AggregateRoot<PurchaseHistoryProps> {
  private constructor(props: PurchaseHistoryProps, id?: string) {
    super(props, id);
  }

  static create(props: PurchaseHistoryProps, id?: string) {
    return new PurchaseHistory(props, id);
  }
}
