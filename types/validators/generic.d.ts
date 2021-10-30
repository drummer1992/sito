import Checks from "../checks";
import {ValidationError} from "../errors";
import {CheckDto, Message} from "../interfaces";

declare class GenericValidator {
    constructor();

    checks: Checks

    static expand(obj: object): void

    validate(payload: any): Promise<ValidationError[]>

    assert(payload: any): Promise<void | never>

    assertBulk(payload: any): Promise<void | never>

    isValid(payload: any): Promise<boolean>

    check(check: CheckDto): this

    combine(...validators: this[]): GenericValidator

    required(enabled?: boolean): this

    forbidden(enabled?: boolean): this

    message(message: string | Message): this
}

export default GenericValidator