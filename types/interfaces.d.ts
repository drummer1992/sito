export interface Message {
    (path: string, value: any, key: string | void): string;
}

export interface Validate {
    (value: any, key: string | number | void, shape: object | [] | void): boolean;
}

interface CheckDto {
    readonly message: Message | string
    readonly validate: Validate
}

interface ValidationParams {
    key: string,
    value: any,
    payload: any,
    path: string | void,
    bulk: boolean,
}