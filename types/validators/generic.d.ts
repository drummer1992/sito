import Checks from "../checks";
import {ValidationError} from "../errors";
import {CheckDto, Mapper, Message} from "../interfaces";

interface TransformOptions {
    optional?: boolean
}

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

    forbidden(enabled?: boolean): this

    message(message: string | Message): this

    transform(mapper: Mapper, options?: TransformOptions): this

    normalize(): this

    default(value: any): this
}

export default GenericValidator