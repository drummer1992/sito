import SchemaValidator from "./schema";
import GenericValidator from "./generic";
import {ValidatorCreator} from "../interfaces";

export interface ArrayShape {
    [index: number]: GenericValidator | ValidatorCreator
}

declare class ArrayValidator extends SchemaValidator {
    static create(data: ValidatorCreator | GenericValidator | []): ArrayValidator

    shape(shape: ArrayShape): this

    extends(shape: ArrayShape | ArrayValidator): this

    notEmpty(): this

    max(n: number): this

    min(n: number): this
}

export default ArrayValidator