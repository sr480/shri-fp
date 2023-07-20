/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const pipe = (...fns) => {
    return (value) => {
        let result = value;
        for (const fn of fns) {
            result = fn(result);
        }
        return result;
    }
}
const flip = (fn) => (...args) => fn(...args.reverse());

const partial = (fn, ...values) => (...args) => fn(...values, ...args);
const partialRight = (fn, ...values) => (...args) => fn(...args, ...values);


const curry = function (func) {
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
const curryRight = function (func) {
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

const log = (value) => {
    console.log(value);
    return value;
};

const allPass = (...fns) => (value) => fns.every(fn => fn(value));
const anyPass = (...fns) => (value) => fns.some(fn => fn(value));

const checkColor = (a, b) => a === b;
const isRed = partial(checkColor, 'red');
const isGreen = partial(checkColor, 'green');
const isBlue = partial(checkColor, 'blue');
const isOrange = partial(checkColor, 'orange');
const isWhite = partial(checkColor, 'white');

const getStar = (a) => a.star;
const getSquare = (a) => a.square;
const getTriangle = (a) => a.triangle;
const getCircle = (a) => a.circle;

const count = (...predicates) => (value) => predicates.filter(pred => pred(value)).length;

const countByColor = (isColor) => count(
    pipe(getTriangle, isColor),
    pipe(getStar, isColor),
    pipe(getCircle, isColor),
    pipe(getSquare, isColor)
);

const countGreen = countByColor(isGreen);
const countRed = countByColor(isRed);
const countBlue = countByColor(isBlue);
const countOrange = countByColor(isOrange);

const gte = (value, compareTo) => value >= compareTo;
const gte2 = partialRight(gte, 2);
const gte3 = partialRight(gte, 3);

const or = (pred1, pred2, value) => pred1(value) || pred2(value);
const and = (a) => (b) => a && b;
const negative = (value) => !value;

const equals = (a, b) => a === b;
const curriedEquals = curry((p1, p2, value) => equals(p1(value), p2(value)));
const equals4 = (value) => equals(value, 4);
const equals2 = (value) => equals(value, 2);
const equals1 = (value) => equals(value, 1);

const isRedStarAndGreenSquareOthersAreWhite = allPass(
    pipe(getTriangle, isWhite),
    pipe(getCircle, isWhite),
    pipe(getStar, isRed),
    pipe(getSquare, isGreen)
);

const anyThreeOfSameColor = anyPass(
    pipe(countGreen, gte3),
    pipe(countRed, gte3),
    pipe(countBlue, gte3),
    pipe(countOrange, gte3),
);


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = isRedStarAndGreenSquareOthersAreWhite;

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(countGreen, gte2);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = curriedEquals(countRed, countBlue);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass(
    pipe(getCircle, isBlue),
    pipe(getStar, isRed),
    pipe(getSquare, isOrange)
)

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyThreeOfSameColor;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. 
// Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass(
    pipe(getTriangle, isGreen),
    pipe(countGreen, equals2),
    pipe(countRed, equals1),
)

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(countOrange, equals4);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass(
    pipe(getStar, isRed, negative),
    pipe(getStar, isWhite, negative),
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(countGreen, equals4);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass(
    curriedEquals(getTriangle, getSquare),
    pipe(getTriangle, isWhite, negative)
);
