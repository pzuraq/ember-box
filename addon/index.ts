import Helper from '@ember/component/helper';
import { get, set } from '@ember/object';
import { assert } from '@ember/debug';

const VALUE = Symbol('BOX_VALUE');
const UPDATE = Symbol('BOX_UPDATE');

export type MaybeBox<T> = T | Box<T> | BoxWrapper<T>;
export type Update<T> = (newValue: any) => T;
export type UpdateMiddleware<T> = (newValue: any, _super: Update<T>) => any;

export interface Box<T> {
  [VALUE]: () => T;
  [UPDATE]: (newValue: T) => T;
}

export interface BoxWrapper<T> {
  [VALUE]: () => T;
  [UPDATE]: (newValue: any) => any;
}

class BoxImpl<T> {
  [VALUE]: () => T;
  [UPDATE]: (newValue: any) => any;

  constructor(value: () => T, update: (newValue: any) => any) {
    this[VALUE] = value;
    this[UPDATE] = update;
  }
}

export function box<T>(context: any, path: string) {
  assert(
    'Must provide a context and path to base boxes. The context must be an object or class/function and the path must be a string.',
    context !== null &&
      (typeof context === 'object' || typeof context === 'function') &&
      typeof path === 'string'
  );

  let value = () => get(context, path);
  let update = (newValue: T) => set(context, path, newValue) as T;

  return new BoxImpl(value, update) as Box<T>;
}

export function wrap<T>(maybeBox: MaybeBox<T>, update: UpdateMiddleware<T>) {
  assert(
    'If you are wrapping a box within another box, you must provide an update function. Otherwise, it is not necessary to wrap the box.',
    typeof update === 'function'
  );

  let value;
  let internalUpdate;

  if (maybeBox instanceof BoxImpl) {
    value = maybeBox[VALUE];
    internalUpdate = (newValue: any) => update(newValue, maybeBox[UPDATE]);
  } else {
    value = () => maybeBox;
    internalUpdate = (newValue: any) => newValue;
  }

  return new BoxImpl<T>(value, internalUpdate) as BoxWrapper<T>;
}

export function unwrap<T>(maybeBox: MaybeBox<T>): T {
  return maybeBox instanceof BoxImpl ? maybeBox[VALUE]() : maybeBox;
}

export function update<T>(maybeBox: MaybeBox<T>, newValue: T): T {
  if (maybeBox instanceof BoxImpl) {
    return maybeBox[UPDATE](newValue);
  }

  return newValue;
}

function helper(fn: (params: any[], hash?: any) => any) {
  let helper = class extends Helper {};

  helper.prototype.compute = fn;

  return helper;
}

export const boxHelper = helper(([context, path]) => box(context, path));
export const wrapHelper = helper(([maybeBox, update]) =>
  wrap(maybeBox, update)
);
export const unwrapHelper = helper(([maybeBox]) => unwrap(maybeBox));
export const updateHelper = helper(([maybeBox, maybeVal]) => {
  if (maybeVal !== undefined) {
    return () => update(maybeBox, maybeVal);
  } else {
    return (val: any) => update(maybeBox, val);
  }
});
