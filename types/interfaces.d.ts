import GenericValidator from "./validators/generic";
import Check from "./checks/check";

export interface Message {
    (path: string, value: any, key: string | void, shape: any, root: any): string | Promise<string>;
}

export interface Validate {
    (value: any, key: string | number | void, shape: any, root: any): boolean | Promise<boolean>;
}

interface Mapper {
    (value: any, key: string | number | void, shape: any, root: any): Promise<any> | any;
}

export interface ValidatorCreator {
    (value: any, key: string | number | void, shape: any, root: any): GenericValidator
}

export type CheckDto = {
    message: Message | string
    validate: Validate | boolean
    common?: boolean
    optional?: boolean
    enabled?: boolean
    [key: string]: any
}

export interface ValidationParams {
    readonly key?: string,
    readonly value?: any,
    readonly payload?: any,
    readonly validator: GenericValidator
    path?: string | void,
    throwFirst?: boolean,

    [key: string]: any
}

export interface OnErrorParams extends ValidationParams {
    check: Check
}

export interface OnBulkErrorParams extends ValidationParams {
}