import GenericValidator from "./generic";

declare class NumberValidator extends GenericValidator {
    min(length: number): this

    max(length: number): this

    integer(): this

    positive(): this

    negative(): this

    strict(enabled: boolean): this
}

export default NumberValidator