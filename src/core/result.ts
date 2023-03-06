export type Result<T, E = never> = Ok<T, never> | Err<never, E>;

export interface IResult<T, E> {
  isOk(): this is Ok<T, E>;
  isErr(): this is Err<T, E>;
  unwrap(): T | E;
  map<A>(fn: (value: T) => A): Result<A, E>;
}

export class Ok<T, E> implements IResult<T, E> {
  constructor(public readonly value: T) {}

  public isOk(): this is Ok<T, E> {
    return true;
  }

  public isErr(): this is Err<T, E> {
    return false;
  }

  public unwrap(): T {
    return this.value;
  }

  public map<A>(fn: (value: T) => A): Result<A, E> {
    return ok(fn(this.value));
  }
}

export class Err<T, E> implements IResult<T, E> {
  constructor(public readonly error: E) {}

  public isOk(): this is Ok<T, E> {
    return false;
  }

  public isErr(): this is Err<T, E> {
    return true;
  }

  public unwrap(): E {
    return this.error;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<A>(_fn: (value: T) => A): Result<A, E> {
    return err(this.error);
  }
}

export const ok = <T, E = never>(value: T): Ok<T, E> => new Ok(value);

export const err = <E, T = never>(error: E): Err<T, E> => new Err(error);

export type InferOkTypes<R> = R extends Result<infer T, unknown> ? T : never;
export type InferErrTypes<R> = R extends Result<unknown, infer E> ? E : never;

type ExtractOkTypes<T extends readonly Result<unknown, unknown>[]> = {
  [Idx in keyof T]: T[Idx] extends Result<infer U, unknown> ? U : never;
};

type ExtractErrTypes<T extends Result<unknown, unknown>[]> = {
  [Idx in keyof T]: T[Idx] extends Result<unknown, infer U> ? U : never;
};

type CombineResults<T extends Result<unknown, unknown>[]> = Result<
  ExtractOkTypes<T>,
  ExtractErrTypes<T>[number]
>;

const tuple = <T extends any[]>(...args: T): T => Object.freeze(args);

const appendValueToEndOfList =
  <T>(value: T) =>
  (list: T[]): T[] =>
    [...list, value];

const combineResults = <T, E>(
  results: readonly Result<T, E>[],
): Result<readonly T[], E> =>
  results.reduce(
    (acc, result) =>
      acc.isOk()
        ? result.isErr()
          ? err(result.error)
          : acc.map(appendValueToEndOfList(result.value))
        : acc,
    ok([]) as Result<T[], E>,
  );

export const combine = <T extends Result<unknown, unknown>[]>(
  ...results: T
): CombineResults<T> => {
  const resultTuple = tuple(...results);

  return combineResults(resultTuple) as CombineResults<T>;
};
