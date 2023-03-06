import { UseCaseError } from './use-case-error';

export class UnexpectedError extends UseCaseError {
  constructor(public metadata: any) {
    super(UnexpectedError.name, 'An unexpected error occurred');
  }
}

export type AppError = UnexpectedError;

export const AppErros = {
  UnexpectedError,
};
