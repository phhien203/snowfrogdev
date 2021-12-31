/**
 * Result if a type that represents either success (Ok) or failure (Err).
 * See the [module documentation](https://snowfrogdev.github.io/snowfrogdev/result/) for details.
 */
export abstract class Result<T, E> {
  constructor(protected value: T | E) {}

  /**
   * Returns `true` if the result is `Ok`, `false` otherwise.
   */
  isOk(): this is Ok<T> {
    return this instanceof Ok;
  }

  /**
   * Returns `true` if the result is `Err`, `false` otherwise.
   */
  isErr(): this is Err<E> {
    return !this.isOk();
  }

  /**
   * Maps a `Result<T, E>` to a `Result<U, E>` by applying a function to a
   * contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * # Examples
   *
   * Print the number on each line of a string multiplied by two.
   *
   * ```typescript
   * const lines = "1\n2\n3\n4\n";
   * const parse = (str: string): Result<number, typeof NaN> => {
   *   const num = parseInt(str, 10);
   *   return isNaN(num) ? new Err(num) : new Ok(num);
   * };
   *
   * for (const num of lines.split("\n")) {
   *   const result = parse(num).map(n => n * 2);
   *   if (result.isOk()) console.log(result.unwrap())
   * }
   * ```
   */
  map<U>(f: (value: T) => U): Result<U, E> {
    return this.isOk() ? new Ok(f(this.value as T)) : new Err((<Err<E>>this).value as E);
  }

  /**
   * Returns the provided default value if the result is `Err`, otherwise
   * applies the function `f` to the `Ok` value and returns the result.
   *
   * Arguments passed to `mapOr` are eagerly evaluated; if you are passing
   * the result of a function call, it is recommended to use `mapOrElse`,
   * which is lazily evaluated.
   *
   * # Examples
   *
   * ```typescript
   * const x = new Ok("foo");
   * expect(x.mapOr(42, str => str.length)).toBe(3);
   *
   * const y = new Err("bar");
   * expect(y.mapOr(42, str => str.length)).toBe(42);
   * ```
   */
  mapOr<U>(defaultValue: U, f: (value: T) => U): U {
    return this.isOk() ? f(this.value as T) : defaultValue;
  }

  mapOrElse<U>(defaultValue: (e: E) => U, f: (value: T) => U): U {
    return this.isOk() ? f(this.value as T) : defaultValue((<Err<E>>this).value as E);
  }

  and<U>(res: Result<U, E>): Result<U, E> {
    return this.isOk() ? res : new Err((<Err<E>>this).value as E);
  }

  andThen<U>(f: (value: T) => Result<U, E>): Result<U, E> {
    return this.isOk() ? f(this.value as T) : new Err((<Err<E>>this).value as E);
  }

  or<F>(res: Result<T, F>): Result<T, F> {
    return this.isOk() ? new Ok(this.value as T) : res;
  }

  orElse<F>(f: (err: E) => Result<T, F>): Result<T, F> {
    return this.isOk() ? new Ok(this.value as T) : f((<Err<E>>this).value as E);
  }

  unwrapOr(defaultValue: T): T {
    return this.isOk() ? (this.value as T) : defaultValue;
  }

  unwrapOrElse(f: (err: E) => T): T {
    return this.isOk() ? (this.value as T) : f((<Err<E>>this).value as E);
  }

  expect(message: string): T {
    if (this.isErr()) throw new Error(`${message}: ${this.value as E}`);
    return (<Ok<T>>this).value as T;
  }

  unwrap(): T {
    if (this.isErr()) throw new Error(`called \`Result.unwrap()\` on an \`Err\` value: "${this.value as E}"`);
    return (<Ok<T>>this).value as T;
  }

  expectErr(message: string): E {
    if (this.isOk()) throw new Error(`${message}: ${this.value as T}`);
    return (<Err<E>>this).value as E;
  }

  unwrapErr(): E {
    if (this.isOk()) throw new Error(`called \`Result.unwrapErr()\` on an \`Ok\` value: ${this.value as T}`);
    return (<Err<E>>this).value as E;
  }
}

export class Ok<T> extends Result<T, any> {
  constructor(value: T) {
    super(value);
  }
}

export class Err<E> extends Result<any, E> {
  constructor(value: E) {
    super(value);
  }
}
