import { ValidationNotExecutedError } from 'src/domains/kakao-chatbot/domain/errors';

export class Validation {
  private wasExecuted = false;

  public checkExecution(): void {
    if (this.wasExecuted === false) {
      throw new ValidationNotExecutedError();
    }
  }

  public onExecuted(): void {
    this.wasExecuted = true;
  }
}
