import { helper } from '@ember/component/helper';
import { set as emberSet } from '@ember/object';

const VALUE = Symbol('VALUE');
const SET = Symbol('SET');

class Box {
  constructor(value, set) {
    this[VALUE] = value;
    this[SET] = set;
  }
}

function box([maybeBox], { context, path, set }) {
  let value, setter;

  if (maybeBox instanceof Box) {
    value = maybeBox[VALUE];
    setter = maybeBox[SET];
  } else {
    value = maybeBox;
    setter =
      context && path
        ? newValue => emberSet(context, path, newValue)
        : () => {};
  }

  if (typeof set === 'function') {
    let originalSetter = setter;

    setter = newValue => set(newValue, originalSetter);
  }

  return new Box(value, setter);
}

export function getBox(maybeBox) {
  return maybeBox instanceof Box ? maybeBox[VALUE] : maybeBox;
}

export function setBox(maybeBox, val) {
  if (maybeBox instanceof Box) {
    let set = maybeBox[SET];

    set(val);
  }
}

export const boxHelper = helper(box);
export const getBoxHelper = helper(([b]) => getBox(b));
export const setBoxHelper = helper(([b]) => val => setBox(b, val));
