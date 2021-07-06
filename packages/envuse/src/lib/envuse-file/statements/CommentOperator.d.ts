import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";
import { VariableKey } from "./Variable";
import { Block } from "./Root";
export declare class OperatorStatementVariable extends Base {
    prepare(bufferCursor: BufferCursor<BCharType>): void;
}
export declare class StatementObject extends Base {
    static types: {
        readonly Boolean: "Boolean";
        readonly Number: "Number";
        readonly String: "String";
        readonly NameInstance: "NameInstance";
        readonly StrictEquality: "StrictEquality";
    };
    type: string;
    value: any;
    prepare(bufferCursor: BufferCursor<BCharType>): void;
}
export declare class CommentOperatorStatement extends Base {
    prepare(bufferCursor: BufferCursor<BCharType>): void;
}
export declare class CommentOperator extends Base {
    operator: VariableKey;
    statement: CommentOperatorStatement;
    block: Block;
    prepare(bufferCursor: BufferCursor<BCharType>): void;
}
