import {CheckDto, ValidationParams} from "../interfaces";
import Check from "./check";
import {ValidationError} from "../errors";

declare class Checks {
    extra: { [key: string]: any }

    execute(params: ValidationParams): Promise<ValidationError | never>

    add(checkDto: CheckDto): void

    last(): Check

    values(): Check[]
}

export default Checks