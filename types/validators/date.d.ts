import GenericValidator from "./generic";

declare class DateValidator extends GenericValidator {
    inFuture(): this

    inPast(): this

    today(): this

    before(date: Date | Number): this

    after(date: Date | Number): this
}

export default DateValidator