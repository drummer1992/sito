import {CheckDto, OnBulkErrorParams, OnErrorParams, ValidatorCreator} from "./interfaces";
import GenericValidator from "./validators/generic";
import StringValidator from "./validators/string";
import NumberValidator from "./validators/number";
import ObjectValidator, {ObjectShape} from "./validators/object";
import ArrayValidator, {ArrayShape} from "./validators/array";
import {BulkValidationError, ValidationError} from "./errors";
import DateValidator from "./validators/date";

export {GenericValidationError, ValidationError, BulkValidationError} from './errors'

export {default as GenericValidator} from './validators/generic';
export {default as SchemaValidator} from './validators/schema';
export {default as StringValidator} from './validators/string';
export {default as NumberValidator} from './validators/number';
export {default as ObjectValidator} from './validators/object';
export {default as ArrayValidator} from './validators/array';
export {default as DateValidator} from './validators/date';

export function check(check: CheckDto): GenericValidator

export function combine(...validators: GenericValidator[]): GenericValidator

export function compose(...validators: GenericValidator[]): GenericValidator

export function required(enabled?: boolean): GenericValidator

export function forbidden(enabled?: boolean, ignoreEmpty?: boolean): GenericValidator

export function exists(enabled?: boolean): GenericValidator

export function oneOf(values: any[]): GenericValidator

export function string(): StringValidator

export function number(): NumberValidator

export function date(): DateValidator

export function boolean(): GenericValidator

export function object(validator?: GenericValidator | ObjectShape | ValidatorCreator): ObjectValidator

export function array(shape?: GenericValidator | ArrayShape | ValidatorCreator): ArrayValidator

export function validate(
    validator: GenericValidator | ValidatorCreator,
    payload: any,
    customOptions?: { [key: string]: any }
): Promise<ValidationError[]>

export function assert(
    validator: GenericValidator | ValidatorCreator,
    payload: any,
    customOptions?: { [key: string]: any }
): Promise<void | never>

export function assertBulk(
    validator: GenericValidator | ValidatorCreator,
    payload: any,
    customOptions?: { [key: string]: any }
): Promise<void | never>

export const interceptor: {
    onError(fn: (error: ValidationError, params: OnErrorParams) => any): void
    onBulkError(fn: (error: BulkValidationError, params: OnBulkErrorParams) => any): void
}