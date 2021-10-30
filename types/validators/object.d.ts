import SchemaValidator, {ValidatorCreator} from "./schema";
import GenericValidator from "./generic";

export interface ObjectShape {
    [key: string]: GenericValidator | ValidatorCreator
}

declare class ObjectValidator extends SchemaValidator {
    static create(data: ValidatorCreator | GenericValidator | []): ObjectValidator

    shape(shape: ObjectShape): this

    notEmpty(): this
}

export default ObjectValidator