/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import { allPass, getProp, gt, lt, partial, partialRight, pipe, reject, runIfTrueOrElse, tap, then, thenPipe } from './mamda';

const api = new Api();

const requestNumberConverter = api.get('https://api.tech/numbers/base');
const toBinnary = (value) => requestNumberConverter({ from: 10, to: 2, number: value });
const requestAnimal = (id) => api.get(`https://animals.tech/${id}`, {});

const getStringLength = getProp('length');
const getResult = getProp('result');

const square = (value) => value ** 2;
const mod3 = (value) => value % 3;

const gt2 = partialRight(gt, 2);
const lt10 = partialRight(lt, 10);

const isPositiveNumber = (value) => /^\d+(.\d+)?$/.test(value);

const validateInput = allPass(
    pipe(getStringLength, gt2),
    pipe(getStringLength, lt10),
    isPositiveNumber
)

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const tapLog = tap(writeLog);

    const onValidationError = partial(handleError, 'ValidationError');
    const onSuccess = then(handleSuccess);
    const onError = reject(handleError);

    const thenRequestAnimal = then(requestAnimal);
    const thenPorecessNumberResponse = thenPipe(
        getResult,
        tapLog,
        getStringLength,
        tapLog,
        square,
        mod3,
        tapLog
    );
    const thenGetResult = thenPipe(getResult);

    const sequence =
        pipe(
            tapLog,
            Number,
            Math.round,
            tapLog,
            toBinnary,
            thenPorecessNumberResponse,
            thenRequestAnimal,
            thenGetResult,
            onSuccess,
            onError
        );
    const validateAndRun = runIfTrueOrElse(validateInput, sequence, onValidationError);

    validateAndRun(value);
}

export default processSequence;
