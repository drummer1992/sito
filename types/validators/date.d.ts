import GenericValidator from "./generic";

declare class DateValidator extends GenericValidator {
    inFuture(): this

    inPast(): this

    today(): this
}

export default DateValidator