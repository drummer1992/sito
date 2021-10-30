export declare class GenericValidationError extends Error {
    constructor(message: string)

    message: string;
    name: string;
}

export declare class ValidationError extends GenericValidationError {
    path: string | void;
    key: string | void;
    value: any;
}

export declare class BulkValidationError extends GenericValidationError {
    errors: ValidationError[]
}