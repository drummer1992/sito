import SchemaValidator from "./schema";
import GenericValidator from "./generic";
import {ValidatorCreator} from "../interfaces";

export interface ObjectShape {
    [key: string]: GenericValidator | ValidatorCreator
}

declare class ObjectValidator extends SchemaValidator {
    static create(data: ValidatorCreator | GenericValidator | []): ObjectValidator

    shape(shape: ObjectShape): this

    extends(shape: ObjectShape | ObjectValidator): this

    notEmpty(): this
}

export default ObjectValidator