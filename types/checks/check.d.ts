import {CheckDto, Message, Validate, ValidationParams} from "../interfaces";
import {ValidationError} from "../errors";

declare class Check {
    constructor(checkDto: CheckDto)

    readonly message: Message
    readonly validate: Validate

    execute(params: ValidationParams): Promise<ValidationError>
}

export default Check