import { Some } from '@snowfrog/option';
import { from } from '../internal';

describe('Iter', () => {
  it('any() basic usage', () => {
    const arr = [1, 2, 3];

    expect(from(arr).any((x) => x > 0)).toBe(true);
    expect(from(arr).any((x) => x > 5)).toBe(false);
  });

  it('any() stopping at the first `true`', () => {
    const arr = [1, 2, 3];

    const iter = from(arr);

    expect(iter.any((x) => x !== 2)).toBe(true);
    expect(iter.next()).toEqual(new Some(2));
  });
});
