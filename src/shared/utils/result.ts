export type Result<T, E> = Ok<T, E> | Err<T, E>;

export interface IResult<T, E> {
  isOk(): this is Ok<T, E>;
  isErr(): this is Err<T, E>;
  unwrapOr<D>(defaultValue: D): T | D;
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

  public unwrapOr(): T {
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

  public unwrapOr<D>(defaultValue: D): D {
    return defaultValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public map<A>(_fn: (value: T) => A): Result<A, E> {
    return err(this.error);
  }
}

export const ok = <T, E>(value: T): Ok<T, E> => new Ok(value);

export const err = <T, E>(error: E): Err<T, E> => new Err(error);

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

export const combine = <T extends Result<unknown, unknown>[]>(
  ...results: T
): CombineResults<T> => {
  const resultTuple = tuple(...results);

  return resultTuple.reduce((acc, result) => {
    if (acc.isOk()) {
      return result.isErr()
        ? result
        : acc.map((arr) => [...(arr as Array<unknown>), result.unwrapOr()]);
    } else {
      return acc;
    }
  }, ok([]) as Result<unknown[], unknown>) as CombineResults<T>;
};
