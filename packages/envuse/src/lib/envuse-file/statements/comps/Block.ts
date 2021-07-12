import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { Comment } from "./Comment";
import { CommentOperator } from "./CommentOperator";
import { Variable } from "./Variable";
import { SpaceNewLine } from "./SpaceNewLine";


export class Block extends Base {
  $type = 'Block' as const

  propsMutable!: "handleCheckCloseBlock";

  prepare(bufferCursor: BufferCursor) {
    while (bufferCursor.has()) {
      if (this.handleCheckCloseBlock) {
        const requireClose = this.handleCheckCloseBlock.call(
          this,
          bufferCursor
        );
        if (requireClose) {
          break;
        }
      }

      if (this.intent(bufferCursor)) {
        continue;
      }

      this.rejectUnexpectedTokenError();
    }
  }

  intent(bufferCursor: BufferCursor<number>) {
    if (bufferCursor.has() && [0x20, 0x0a].includes(bufferCursor.current())) {
      this.children.push(this.createElement(SpaceNewLine));
      return true;
    }

    if (bufferCursor.has() && Variable.charactersKey.includes(bufferCursor.current())) {
      this.children.push(this.createElement(Variable));
      return true;
    }

    if (bufferCursor.current() === 0x23 && bufferCursor.next(1)[0] === 0x3b) {
      this.children.push(this.createElement(CommentOperator));
      return true;
    }

    if (bufferCursor.current() === 0x23) {
      this.children.push(this.createElement(Comment));
      return true;
    }

    return false;
  }

  handleCheckCloseBlock?: (
    this: Base,
    bufferCursor: BufferCursor<number>
  ) => boolean;
}
