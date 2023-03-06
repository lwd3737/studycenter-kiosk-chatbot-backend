export class EntityID {
  private readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  get value(): string {
    return this.id;
  }

  public equals(id: object | string): boolean {
    if (typeof id === 'string') {
      return this.id === id;
    }

    if (id instanceof EntityID) {
      return this.id === id.value;
    }

    return false;
  }
}
