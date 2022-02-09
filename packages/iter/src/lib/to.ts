import { None, Option, Some } from '@snowfrog/option';
import { Err, Ok, Result } from '@snowfrog/result';
import { Iter } from './internal';

export type Constructor<T> = new (...args: any[]) => T;
export type AbstractConstructor<T = Record<string, unknown>> = abstract new (...args: any[]) => T;

export type IterCtor<T> = Constructor<Iter<T>>;

export function mixinIter<T, B extends AbstractConstructor<Record<string, any>>>(base: B): IterCtor<T> & B;
export function mixinIter<T, B extends Constructor<Record<string, any>>>(base: B): IterCtor<T> & B {
  return class extends base {
    next(): Option<T> {
      throw new Error('next() is not implemented and needs to be overridden');
    }

    [Symbol.iterator](): Iterator<T> {
      throw new Error('[Symbol.iterator] is not implemented and needs to be overridden');
    }

    all(f: (x: T) => boolean): boolean {
      for (const item of this) {
        if (!f(item)) return false;
      }
      return true;
    }

    advanceBy(n: number): Result<never[], number> {
      for (let i = 0; i < n; i++) {
        if (this.next().isNone()) return new Err(i);
      }

      return new Ok([]);
    }

    count(): number {
      let count = 0;
      for (const _ of this) {
        count++;
      }
      return count;
    }

    find(predicate: (item: T) => boolean): Option<T> {
      for (const item of this) {
        if (predicate(item)) {
          return new Some(item);
        }
      }
      return new None();
    }

    fold<B>(init: B, f: (acc: B, item: T) => B): B {
      let acc = init;
      for (const item of this) {
        acc = f(acc, item);
      }
      return acc;
    }

    nth(n: number): Option<T> {
      if (this.advanceBy(n).isErr()) return new None();
      return this.next();
    }
  };
}
