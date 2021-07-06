/// <reference types="node" />
import { BufferCursor } from "./BufferCursor";
declare type B<T> = T extends {
    propsMutable: infer R;
} ? R extends keyof T ? Partial<Pick<T, R>> : {} : {};
export declare abstract class Base {
    #private;
    pos: number;
    end: number;
    children: Base[];
    raw: Buffer;
    _raw: string;
    constructor(filename: string | null, body: Buffer, pos: number, bufferCursor?: BufferCursor<number | undefined>);
    get filename(): string | null;
    get bufferCursor(): BufferCursor<number | undefined>;
    get body(): Buffer;
    private load;
    createElement<T extends Base>(Comp: {
        new (filename: string | null, body: Buffer, pos: number, bufferCursor?: BufferCursor): T;
    }, assign?: B<T>): T;
    static createElement<T extends Base>(comp: T, assign?: B<T>): T;
    abstract prepare(bufferCursor: BufferCursor): void;
    appendRaw(raw: Buffer | number): this;
    iter(): Generator<readonly [number, Buffer, {
        readonly current_char: Buffer;
        readonly current_index: number;
        readonly prev: (len: number) => Buffer;
        readonly next: (len: number) => Buffer;
    }], void, unknown>;
    rejectUnexpectedTokenError(): never;
    toJSON(): {};
}
export {};
