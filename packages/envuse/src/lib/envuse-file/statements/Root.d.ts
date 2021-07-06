import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
export declare class Block extends Base {
    propsMutable: 'handleCheckCloseBlock';
    prepare(bufferCursor: BufferCursor): void;
    intent(bufferCursor: BufferCursor<number>): boolean;
    handleCheckCloseBlock?: (this: Base, bufferCursor: BufferCursor<number>) => boolean;
}
