import SchemaValidator from "./schema";
import GenericValidator from "./generic";
import {ValidatorCreator} from "../interfaces";

export interface ObjectShape {
    [key: string]: GenericValidator | ValidatorCreator
}

export type WhenOption = 'beforeValidation' | 'afterValidation' | 'onError'

export interface RenameOptions {
    when?: WhenOption
    override?: boolean
}

export interface MappingOptions extends RenameOptions {}

declare class ObjectValidator extends SchemaValidator {
    static create(data: ValidatorCreator | GenericValidator | []): ObjectValidator

    shape(shape: ObjectShape): this

    extends(shape: ObjectShape | ObjectValidator): this

    notEmpty(): this

    rename(from: string, to: string, options?: RenameOptions): this

    mapping(map: Record<string, string>, options?: MappingOptions): this
}

export default ObjectValidator