import { AggregateRoot, EntityID } from 'src/core/domain';

export interface PurchaseHistoryProps {
  user: EntityID;
  ticket: EntityID;
  seat: EntityID;
}

export class PurchaseHistory extends AggregateRoot<PurchaseHistoryProps> {
  private constructor(props: PurchaseHistoryProps, id?: string) {
    super(props, id);
  }

  static create(props: PurchaseHistoryProps, id?: string) {
    return new PurchaseHistory(props, id);
  }
}
