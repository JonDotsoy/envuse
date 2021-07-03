import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { Comment } from "./Comment";
import { CommentOperator } from "./CommentOperator";
import { Variable } from "./Variable";
import { SpaceNewLine } from "./Space";

class None extends Base {
  prepare(bufferCursor: BufferCursor<number | undefined>): void {
    while (bufferCursor.has()) {
      this.appendRaw(bufferCursor.current())
      bufferCursor.forward()
    }
  }
}

export class Block extends Base {
  propsMutable!: 'handleCheckCloseBlock'

  prepare(bufferCursor: BufferCursor) {
    while (bufferCursor.has()) {
      if (this.handleCheckCloseBlock) {
        const requireClose = this.handleCheckCloseBlock.call(this, bufferCursor)
        if (requireClose) {
          break
        }
      }

      if (this.intent(bufferCursor)) {
        continue
      }

      this.rejectUnexpectedTokenError()
    }

    this.end = bufferCursor.position
  }

  intent(bufferCursor: BufferCursor<number>) {
    if ([0x20, 0x0a].includes(bufferCursor.current())) {
      this.children.push(this.createElement(SpaceNewLine))
      return true
    }

    if (Variable.charactersKey.includes(bufferCursor.current())) {
      this.children.push(this.createElement(Variable))
      return true
    }

    if (bufferCursor.current() === 0x23 && bufferCursor.next(1)[0] === 0x3b) {
      this.children.push(this.createElement(CommentOperator))
      return true
    }

    if (bufferCursor.current() === 0x23) {
      this.children.push(this.createElement(Comment))
      return true
    }

    return false
  }

  handleCheckCloseBlock?: (this: Base, bufferCursor: BufferCursor<number>) => boolean;
}
