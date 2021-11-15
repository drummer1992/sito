import {CheckDto, Message, Validate, ValidationParams} from "../interfaces";
import {ValidationError} from "../errors";

interface CheckValidationParams extends ValidationParams {
    extra: object
}

declare class Check {
    constructor(checkDto: CheckDto)

    optional: boolean
    enabled: boolean
    common: boolean
    [key: string]: any

    message: Message

    validate: Validate

    execute(params: CheckValidationParams): Promise<ValidationError>
}

export default Check