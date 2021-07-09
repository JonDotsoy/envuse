import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";
import { Space } from "./Space";
import { VariableKey } from "./Variable";
import { Block } from "./Block";
import { CharactersKey as K } from "./CharactersKey";
import { toBuffer as b } from "./toBuffer";
import { CommentOperatorStatement } from "./CommentOperatorStatement";

export class CommentOperator extends Base {
  operator!: VariableKey;
  statement!: CommentOperatorStatement;
  block!: Block;

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    bufferCursor.forward(2);

    if (bufferCursor.current() === K.space) this.createElement(Space);

    this.operator = this.createElement(VariableKey);

    switch (this.operator.raw.toString()) {
      case "if":
        break;
      case "fi":
        break;
      default: {
        bufferCursor.backward(this.operator.raw.length);
        this.rejectUnexpectedTokenError();
      }
    }

    if (this.operator.raw.equals(b("fi"))) {
      return;
    }

    this.createElement(Space);

    this.statement = this.createElement(CommentOperatorStatement);

    this.block = this.createElement(Block, {
      handleCheckCloseBlock() {
        const lastChild = this.children[this.children.length - 1];
        if (
          lastChild instanceof CommentOperator &&
          lastChild.operator.raw.equals(b("fi"))
        ) {
          return true;
        }
        return false;
      },
    });
  }
}
