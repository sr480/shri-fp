export const pipe = (...fns) => {
  return (value) => {
    let result = value;
    for (const fn of fns) {
      result = fn(result);
    }
    return result;
  }
}
export const flip = (fn) => (...args) => fn(...args.reverse());

export const partial = (fn, ...values) => (...args) => fn(...values, ...args);
export const partialRight = (fn, ...values) => (...args) => fn(...args, ...values);


export const curry = function (func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}
export const curryRight = function (func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, [...args].reverse());
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

export const tap = (fn) => (value) => {
  fn(value);
  return value;
}
export const log = tap(console.log);

export const then = (fn) => (promise) => promise.then(fn);
export const reject = (fn) => (promise) => promise.catch(fn);

export const gte = (value, compareTo) => value >= compareTo;
export const gt = (value, compareTo) => value > compareTo;
export const lt = (value, compareTo) => value < compareTo;

export const equals = (a, b) => a === b;

export const negative = (value) => !value;

export const allPass = (...fns) => (value) => fns.every(fn => fn(value));
export const anyPass = (...fns) => (value) => fns.some(fn => fn(value));

export const runIfTrueOrElse = (validator, ifTrue, ifFalse) => (value) => {
  if (validator(value)) {
    ifTrue(value);
  } else {
    ifFalse(value);
  }
}

export const getProp = (prop) => (value) => value[prop];

export const thenPipe = (...args) => then(pipe(...args));