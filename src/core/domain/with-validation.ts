import { ValidationNotExecutedError } from 'src/modules/kakao-chatbot';

export class Validation {
  private wasExecuted: boolean;

  constructor() {
    this.wasExecuted = false;
  }

  public checkExecution(): void {
    if (this.wasExecuted === false) {
      throw new ValidationNotExecutedError();
    }
  }

  public onExecuted(): void {
    this.wasExecuted = true;
  }
}
