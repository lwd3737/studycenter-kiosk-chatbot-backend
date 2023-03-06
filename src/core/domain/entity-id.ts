import { IdentifierGenerator } from '../infra';

export class EntityId {
  private readonly id: string;

  constructor(id?: string) {
    this.id = id ?? IdentifierGenerator.generate();
  }

  get value(): string {
    return this.id;
  }

  public equals(id: EntityId | string): boolean {
    if (typeof id === 'string') {
      return this.id === id;
    }

    if (id instanceof EntityId) {
      return this.id === id.value;
    }

    return false;
  }
}
