export interface Message {
    (path: string, value: any, key: string | void): string | Promise<string>;
}

export interface Validate {
    (value: any, key: string | number | void, shape: object | [] | void): boolean | Promise<boolean>;
}

export interface Extra {
    [key: string]: any;
}

export type CheckDto = {
    message: Message | string
    validate: Validate
    common?: boolean
    optional?: boolean
    enabled?: boolean
}

export type ValidationParams = {
    key: string,
    value: any,
    payload: any,
    path: string | void,
    bulk: boolean,
}