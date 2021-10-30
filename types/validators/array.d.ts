import SchemaValidator, {ValidatorCreator} from "./schema";
import GenericValidator from "./generic";

export interface ArrayShape {
    [idx: number]: GenericValidator | ValidatorCreator
}

declare class ArrayValidator extends SchemaValidator {
    static create(data: ValidatorCreator | GenericValidator | []): ArrayValidator

    shape(shape: ArrayShape): this

    notEmpty(): this
}

export default ArrayValidator