import { ValidationNotExecutedError } from 'src/modules/kakao-chatbot/domain/errors';

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
