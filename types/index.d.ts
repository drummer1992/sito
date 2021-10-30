import {CheckDto} from "./interfaces";
import GenericValidator from "./validators/generic";
import StringValidator from "./validators/string";
import NumberValidator from "./validators/number";
import ObjectValidator, {ObjectShape} from "./validators/object";
import ArrayValidator, { ArrayShape } from "./validators/array";
import {ValidatorCreator} from "./validators/schema";

export { GenericValidationError, ValidationError, BulkValidationError } from './errors'

export { default as GenericValidator } from './validators/generic';
export { default as SchemaValidator } from './validators/schema';
export { default as StringValidator } from './validators/string';
export { default as NumberValidator } from './validators/number';
export { default as ObjectValidator } from './validators/object';
export { default as ArrayValidator } from './validators/array';

export function check(check: CheckDto): GenericValidator

export function required(enabled?: boolean): GenericValidator

export function forbidden(enabled?: boolean): GenericValidator

export function exists(enabled?: boolean): GenericValidator

export function oneOf(values: any[]): GenericValidator

export function string(): StringValidator

export function number(): NumberValidator

export function object(value: ObjectShape | ValidatorCreator | GenericValidator): ObjectValidator

export function array(value: ArrayShape | ValidatorCreator | GenericValidator): ArrayValidator
