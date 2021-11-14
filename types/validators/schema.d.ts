import GenericValidator from "./generic";
import {ObjectShape} from "./object";
import {ArrayShape} from "./array";
import {ValidatorCreator} from "../interfaces";

declare class SchemaValidator extends GenericValidator {
    static create(data: ValidatorCreator | GenericValidator): SchemaValidator

    strict(isStrict?: boolean): this

    of(shapeValidator: ValidatorCreator | GenericValidator): this

    shape(shape: ObjectShape | ArrayShape): this

    extends(shape: ObjectShape | ArrayShape | SchemaValidator): this
}

export default SchemaValidator
