import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { BCharType } from "../tdo/BCharType";
import { Space } from "./Space";
import { VariableKey } from "./VariableKey";
import { Block } from "./Block";
import { CharactersKey as K } from "../tdo/CharactersKey";
import { toBuffer as b } from "../lib/toBuffer";
import { CommentOperatorStatement } from "./CommentOperatorStatement";


export class CommentOperator extends Base {
  $type = 'CommentOperator' as const;
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

  toJSON() {
    return {
      ...super.toJSON(),
      operator: this.operator,
      statement: this.statement,
      block: this.block,
    }
  }
}
