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

import { allPass, anyPass, curry, equals, getProp, gte, lt, negative, partial, partialRight, pipe } from "./mamda";

const checkColor = (a, b) => a === b;
const isRed = partial(checkColor, 'red');
const isGreen = partial(checkColor, 'green');
const isBlue = partial(checkColor, 'blue');
const isOrange = partial(checkColor, 'orange');
const isWhite = partial(checkColor, 'white');

const getStar = getProp('star');
const getSquare = getProp('square');
const getTriangle = getProp('triangle');
const getCircle = getProp('circle');

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
const countWhite = countByColor(isWhite);

const gte2 = partialRight(gte, 2);
const gte3 = partialRight(gte, 3);
const lt2 = partialRight(lt, 2);

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

const anyThreeOfSameColorNotWhite = anyPass(
    pipe(countGreen, gte3),
    pipe(countRed, gte3),
    pipe(countBlue, gte3),
    pipe(countOrange, gte3)
);

const isBlueCircle = pipe(getCircle, isBlue);
const isRedStar = pipe(getStar, isRed);
const isOrangeSquare = pipe(getSquare, isOrange);


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = isRedStarAndGreenSquareOthersAreWhite;

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(countGreen, gte2);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = curriedEquals(countRed, countBlue);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass(
    isBlueCircle,
    isRedStar,
    isOrangeSquare
)

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyThreeOfSameColorNotWhite;

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
