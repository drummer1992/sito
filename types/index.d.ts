import {CheckDto, Extra, ValidationParams} from "./interfaces";
import GenericValidator from "./validators/generic";
import StringValidator from "./validators/string";
import NumberValidator from "./validators/number";
import ObjectValidator, {ObjectShape} from "./validators/object";
import ArrayValidator, {ArrayShape} from "./validators/array";
import {ValidatorCreator} from "./validators/schema";
import {ValidationError} from "./errors";

export {GenericValidationError, ValidationError, BulkValidationError} from './errors'

export {default as GenericValidator} from './validators/generic';
export {default as SchemaValidator} from './validators/schema';
export {default as StringValidator} from './validators/string';
export {default as NumberValidator} from './validators/number';
export {default as ObjectValidator} from './validators/object';
export {default as ArrayValidator} from './validators/array';

export function check(check: CheckDto): GenericValidator

export function combine(...validators: GenericValidator[]): GenericValidator

export function required(enabled?: boolean): GenericValidator

export function forbidden(enabled?: boolean): GenericValidator

export function exists(enabled?: boolean): GenericValidator

export function oneOf(values: any[]): GenericValidator

export function string(): StringValidator

export function number(): NumberValidator

export function boolean(): GenericValidator

declare function object(shape: ObjectShape): ObjectValidator

declare function object(validatorCreator: ValidatorCreator): ObjectValidator

declare function object(validator: GenericValidator): ObjectValidator

declare function array(shape: ArrayShape): ArrayValidator

declare function array(validatorCreator: ValidatorCreator): ArrayValidator

declare function array(validator: GenericValidator): ArrayValidator

export function validate(params: ValidationParams): Promise<ValidationError[]>

export const interceptor: {
    register(interceptFn: (error: ValidationError, extra: Extra) => any): void
}

export {object, array}