import { Option } from '@snowfrog/option';
import { Result } from '@snowfrog/result';
import { MapIter } from './internal';

export interface Iter<T> extends Iterable<T> {
  advanceBy(n: number): Result<never[], number>;
  all(f: (x: T) => boolean): boolean;
  any(f: (x: T) => boolean): boolean;
  count(): number;
  find(predicate: (item: T) => boolean): Option<T>;
  fold<B>(init: B, f: (acc: B, item: T) => B): B;
  last(): Option<T>;
  map<B>(f: (item: T) => B): MapIter<this, T, B>;
  next(): Option<T>;
  nth(n: number): Option<T>;
  position(predicate: (x: T) => boolean): Option<number>;
  reduce(f: (acc: T, item: T) => T): Option<T>;
  toArray(): T[];
  toMap<K, V>(this: Iter<[K, V]>): Map<K, V>;
  toSet(): Set<T>;
}

/* export abstract class Iter<T> implements Iterable<T> {
  
  static once<T>(value: T): DoubleEndedIter<T> {
    return Iter.from([value]);
  }

  filter<P extends (item: T) => boolean>(predicate: P): FilterIter<this, T> {
    return new FilterIter(this, predicate);
  }

  skip(n: number): SkipIter<this, T> {
    return new SkipIter(this, n);
  }

  chain<U extends DoubleEndedIter<T>, V extends DoubleEndedIter<T>>(this: U, other: V): ChainDoubleEndedIter<U, V, T>;
  chain(other: Iter<T>): ChainIter<this, Iter<T>, T>;
  chain(other: Iter<T> | DoubleEndedIter<T>): ChainIter<this, Iter<T>, T> {
    if (this.isDoubleEndendIter(this) && this.isDoubleEndendIter(other)) {
      return new ChainDoubleEndedIter(this, other as DoubleEndedIter<T>);
    }
    return new ChainIter(this, other);
  }

  enumerate(): EnumerateIter<this, T> {
    return new EnumerateIter(this);
  }

  flatten<T extends Iterable<U>, U = T extends Iterable<infer U> ? U : never>(
    this: Iter<T>
  ): FlattenIter<Iter<T>, T, U> {
    return new FlattenIter(this);
  }

  flatMap<U>(f: (item: T) => Iterable<U>): FlatMapIter<this, T, Iterable<U>, U> {
    return new FlatMapIter(this, f);
  }

  forEach(f: (item: T) => void): void {
    for (const item of this) {
      f(item);
    }
  }
} */
