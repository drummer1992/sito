import GenericValidator from "./generic";

declare class StringValidator extends GenericValidator {
    min(length: number): this

    max(length: number): this

    length(length: number): this

    notEmpty(): this

    pattern(pattern: RegExp): this
}

export default StringValidator