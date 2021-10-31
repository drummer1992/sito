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

declare namespace Sito {
    function check(check: CheckDto): GenericValidator

    function required(enabled?: boolean): GenericValidator

    function forbidden(enabled?: boolean): GenericValidator

    function exists(enabled?: boolean): GenericValidator

    function oneOf(values: any[]): GenericValidator

    function string(): StringValidator

    function number(): NumberValidator

    function object(shape: ObjectShape): ObjectValidator

    function object(validatorCreator: ValidatorCreator): ObjectValidator

    function object(validator: GenericValidator): ObjectValidator

    function array(shape: ArrayShape): ArrayValidator

    function array(validatorCreator: ValidatorCreator): ArrayValidator

    function array(validator: GenericValidator): ArrayValidator
}

export default Sito
