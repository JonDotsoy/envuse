/// <reference types="node" />
export declare class UnexpectedTokenError extends Error {
    readonly filename: string | null;
    readonly position: number;
    name: string;
    columnNumber: number;
    lineNumber: number;
    lineStyled: string;
    constructor(filename: string | null, body: Buffer, position: number);
    static isUnexpectedTokenError(err: any): err is UnexpectedTokenError;
}
