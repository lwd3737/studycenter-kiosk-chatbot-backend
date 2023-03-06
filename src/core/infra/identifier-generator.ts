import { randomUUID } from 'crypto';

export class IdentifierGenerator {
  public static generate(): string {
    return randomUUID();
  }
}
