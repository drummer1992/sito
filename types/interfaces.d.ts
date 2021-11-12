import GenericValidator from "./validators/generic";
import Check from "./checks/check";

export interface Message {
    (path: string, value: any, key: string | void): string | Promise<string>;
}

export interface Validate {
    (value: any, key: string | number | void, shape: object | [] | void): boolean | Promise<boolean>;
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
    bulk?: boolean,
    [key: string]: any
}

export interface InterceptorOptions extends ValidationParams {
    // @ts-ignore
    extra: Map<any, any>
    check: Check
}