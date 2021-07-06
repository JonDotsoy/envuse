/// <reference types="node" />
import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
export declare class VariableKey extends Base {
    prepare(bufferCursor: BufferCursor): void;
}
export declare class VariableValue extends Base {
    prepare(bufferCursor: BufferCursor): void;
}
export declare class Variable extends Base {
    keyVariable: VariableKey;
    valueVariable: VariableValue;
    prepare(bufferCursor: BufferCursor): void;
    static charactersKey: Buffer;
}
