import GenericValidator from "./generic";
import {ObjectShape} from "./object";
import {ArrayShape} from "./array";

export interface ValidatorCreator {
    (value: any, key: string | number | void, shape: any): GenericValidator
}

declare class SchemaValidator extends GenericValidator {
    static create(data: ValidatorCreator | GenericValidator): SchemaValidator

    strict(isStrict?: boolean): this

    of(shapeValidator: ValidatorCreator | GenericValidator): this

    shape(shape: ObjectShape | ArrayShape): this
}

export default SchemaValidator
