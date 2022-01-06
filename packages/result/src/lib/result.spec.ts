import { Err, Ok, Result } from './internal';

describe('Result<T, E>', () => {
  it.each([
    [new Ok(-3), true],
    [new Err('Some error message'), false],
  ])('isOK()', (sut, result) => {
    expect(sut.isOk()).toBe(result);
  });

  it.each([
    [new Ok(-3), false],
    [new Err('Some error message'), true],
  ])('isErr()', (sut, result) => {
    expect(sut.isErr()).toBe(result);
  });

  it.each([
    [new Ok('foo'), 3],
    [new Err('bar'), 42],
  ])('mapOr()', (sut: Result<string, string>, result) => {
    expect(sut.mapOr(42, (str: string) => str.length)).toBe(result);
  });

  it.each([
    [new Ok('foo'), 3],
    [new Err('bar'), 42],
  ])('mapOrElse()', (sut, result) => {
    expect(
      sut.mapOrElse(
        () => 21 * 2,
        (str: string) => str.length
      )
    ).toBe(result);
  });

  it.each([
    [new Ok(2), new Ok(2)],
    [new Err(13), new Err('error code: 13')],
  ])('mapErr()', (sut, result) => {
    const stringify = (x: number) => `error code: ${x}`;
    expect(sut.mapErr(stringify)).toEqual(result);
  });

  /* TODO: Implement Result.iter() once the Iterator lib is done */

  it.each([
    [new Ok(2), new Err('late error'), new Err('late error')],
    [new Err('early error'), new Ok('foo'), new Err('early error')],
    [new Err('not a 2'), new Err('late error'), new Err('not a 2')],
    [new Ok(2), new Ok('different result type'), new Ok('different result type')],
  ])('and()', (sut: Result<number | string, string>, other, result) => {
    expect(sut.and(other)).toEqual(result);
  });

  type TestFunc = (x: number) => Result<number, number>;
  const sq: TestFunc = (x: number) => new Ok(x * x);
  const err: TestFunc = (x: number) => new Err(x);
  it.each([
    [new Ok(2), sq, sq, new Ok(16)],
    [new Ok(2), sq, err, new Err(4)],
    [new Ok(2), err, sq, new Err(2)],
    [new Err(3), sq, sq, new Err(3)],
  ])('andThen()', (sut: Result<number, number>, f1, f2, result) => {
    expect(sut.andThen(f1).andThen(f2)).toEqual(result);
  });

  it.each([
    [new Ok(2), new Err('late error'), new Ok(2)],
    [new Err('early error'), new Ok(2), new Ok(2)],
    [new Err('not a 2'), new Err('late error'), new Err('late error')],
    [new Ok(2), new Ok(100), new Ok(2)],
  ])('or()', (sut: Result<number | string, number | string>, other, result) => {
    expect(sut.or(other)).toEqual(result);
  });

  it.each([
    [new Ok(2), sq, sq, new Ok(2)],
    [new Ok(2), err, sq, new Ok(2)],
    [new Err(3), sq, err, new Ok(9)],
    [new Err(3), err, err, new Err(3)],
  ])('orElse()', (sut, f1, f2, result) => {
    expect(sut.orElse(f1).orElse(f2)).toEqual(result);
  });

  it.each([
    [new Ok(9), 2, 9],
    [new Err('error'), 2, 2],
  ])('unwrapOr()', (sut, defaultValue, result) => {
    expect(sut.unwrapOr(defaultValue)).toBe(result);
  });

  it.each([
    [new Ok(2), 2],
    [new Err('foo'), 3],
  ])('unwrapOrElse()', (sut: Result<number, string>, result) => {
    const count = (x: string) => x.length;
    expect(sut.unwrapOrElse(count)).toBe(result);
  });

  it('expect() when Ok', () => {
    expect(new Ok(2).expect('Testing expect')).toBe(2);
  });

  it('expect() when Err', () => {
    expect(() => new Err('emergency failure').expect('Testing expect')).toThrowError(
      'Testing expect: emergency failure'
    );
  });

  it('unwrap() when Ok', () => {
    expect(new Ok(2).unwrap()).toBe(2);
  });

  it('unwrap() when Err', () => {
    const result = 'called `Result.unwrap()` on an `Err` value: "emergency failure"';
    expect(() => new Err('emergency failure').unwrap()).toThrowError(result);
  });

  it('expectErr() when Err', () => {
    expect(new Err('foo').expectErr('Testing expectErr')).toBe('foo');
  });

  it('expectErr() when Ok', () => {
    const result = 'Testing expectErr: 10';
    expect(() => new Ok(10).expectErr('Testing expectErr')).toThrowError(result);
  });

  it('unwrapErr() when Ok', () => {
    const result = 'called `Result.unwrapErr()` on an `Ok` value: 2';
    expect(() => new Ok(2).unwrapErr()).toThrowError(result);
  });

  it('unwrapErr() when Err', () => {
    expect(new Err('emergency failure').unwrapErr()).toBe('emergency failure');
  });
});
