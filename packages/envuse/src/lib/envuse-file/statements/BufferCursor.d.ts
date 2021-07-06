/// <reference types="node" />
import { BCharType } from "./BCharType";
declare type Events = {
    forward: () => void;
};
export declare class BufferCursor<T extends BCharType = BCharType> {
    #private;
    private body;
    constructor(body: Buffer);
    on<T extends keyof Events>(event: T, listener: Events[T]): () => void;
    removeListener<T extends keyof Events>(event: T, listener: Events[T]): void;
    private emit;
    get position(): number;
    has(): this is BufferCursor<Exclude<T, undefined>>;
    current(): T;
    forward(steps?: number): T;
    backward(steps?: number): T;
    prev(len: number): number[];
    currentAndPrev(len: number): (number | T)[];
    next(len: number): number[];
    currentAndNext(len: number): (number | T)[];
    isClosed(): any;
}
export {};
