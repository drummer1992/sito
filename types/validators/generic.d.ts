import Checks from "../checks";
import {ValidationError} from "../errors";
import {CheckDto, Mapper, Message, ForbiddenOptions, TransformOptions} from "../interfaces";

declare class GenericValidator {
    constructor();

    checks: Checks

    static expand(obj: object): void

    validate(payload: any, customOptions?: { [key: string]: any }): Promise<ValidationError[]>

    assert(payload: any, customOptions?: { [key: string]: any }): Promise<void | never>

    assertBulk(payload: any, customOptions?: { [key: string]: any }): Promise<void | never>

    isValid(payload: any): Promise<boolean>

    check(check: CheckDto): this

    combine(...validators: GenericValidator[]): this

    required(enabled?: boolean): this

    forbidden(enabled?: boolean, options?: ForbiddenOptions): this

    message(message: string | Message): this

    transform(mapper: Mapper, options?: TransformOptions): this

    normalize(): this

    default(value: any): this

    description(value: string): this

    toJsonSchema(options?: { description?: string, [key: string]: any }): {
        type: string,
        required?: boolean,
        description?: string,
        [key: string]: any
    }
}

export default GenericValidator
