export class UseCaseError extends Error {
  constructor(message: string, public metadata?: any) {
    super(message);
  }
}
