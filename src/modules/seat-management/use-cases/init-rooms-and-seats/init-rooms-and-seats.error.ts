import { AppErrors, DomainError, UseCaseError } from 'src/core';

/* eslint-disable @typescript-eslint/no-namespace */
export type InitRoomsAndSeatsError = AppErrors.UnexpectedError | DomainError;

export namespace InitRoomsAndSeatsErrors {}
