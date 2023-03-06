import { combine, Result } from '../result';

export interface WithChanges<T = any, E = any> {
  changes: Changes<T, E>;
}

export class Changes<T = any, E = any> {
  private changes: Result<T, E>[];

  constructor() {
    this.changes = [];
  }

  public addChange(result: Result<T, E>): void {
    this.changes.push(result);
  }

  public getChangesResult(): Result<T[], E> {
    return combine(...this.changes);
  }
}
