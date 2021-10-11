import { Base } from "./base";
import { BufferCursor } from "../lib/buffer-cursor";
import { BCharType } from "../tdo/b-char-type";
import { Space } from "./space";
import { VariableKey, VariableKeyType } from "./variable-key";
import { Block, BlockType } from "./block";
import { CharactersKey, CharactersKey as K } from "../tdo/characters-key";
import { b } from "../lib/to-buffer";
import {
  CommentOperatorStatement,
  CommentOperatorStatementType,
} from "./comment-operator-statement";
import { BaseSerializeOption } from "../tdo/base-serialize-option";

export type CommentOperatorType = {
  $type: "CommentOperator";
  operator: VariableKeyType;
  statement: CommentOperatorStatementType;
  block: BlockType;
  [k: string]: any;
};

export class CommentOperator extends Base {
  $type = "CommentOperator" as const;
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
        const lastChild = this.lastChildren();
        if (
          lastChild instanceof CommentOperator &&
          lastChild.operator.raw.equals(b("fi"))
        ) {
          this.removeChildren(lastChild);
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
    };
  }

  static serialize(comp: CommentOperatorType) {
    const buff: Buffer[] = [b("")];

    buff.push(
      comp.statement
        ? b(
            `#; ${VariableKey.serialize(
              comp.operator
            )} ${CommentOperatorStatement.serialize(comp.statement)}\n`
          )
        : b(`#; ${VariableKey.serialize(comp.operator)}\n`)
    );

    if (comp.block) {
      buff.push(Block.serialize(comp.block));
    }

    buff.push(b(`#; fi\n`));

    return Buffer.concat(buff);
  }
}
