import {CheckDto, Extra, ValidationParams} from "../interfaces";
import Check from "./check";
import {ValidationError} from "../errors";

declare class Checks {
    extra: Extra

    execute(params: ValidationParams): Promise<ValidationError | never>

    add(checkDto: CheckDto): void

    last(): Check

    values(): Check[]
}

export default Checks