import GenericValidator from "./validators/generic";
import Check from "./checks/check";

export interface Message {
    (path: string, value: any, key: string | void): string | Promise<string>;
}

export interface Validate {
    (value: any, key: string | number | void, shape: object | [] | void): boolean | Promise<boolean>;
}

export interface ValidatorCreator {
    (value: any, key: string | number | void, shape: any): GenericValidator
}

export type CheckDto = {
    message: Message | string
    validate: Validate
    common?: boolean
    optional?: boolean
    enabled?: boolean
    [key: string]: any
}

export type ValidationParams = {
    readonly key?: string,
    readonly value?: any,
    readonly payload?: any,
    readonly validator: GenericValidator
    path?: string | void,
    throwFirst?: boolean,
    [key: string]: any
}

export interface InterceptorParams extends ValidationParams {
    extra: { [key: string]: any }
    check: Check
}