import GenericValidator from "./generic";

declare class NumberValidator extends GenericValidator {
    min(length: number): this

    max(length: number): this

    positive(): this

    negative(): this
}

export default NumberValidator