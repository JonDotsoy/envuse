import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { Iter } from "./Iter";
import { Comment } from "./Comment";
import { Code } from "./Code";
import util from 'util'
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

export class Root extends Base {
  prepare(bufferCursor: BufferCursor) {
    while (bufferCursor.has()) {
      if ([0x20, 0x0a].includes(bufferCursor.current())) {
        this.children.push(this.createElement(SpaceNewLine))
        continue
      }

      if (Variable.charactersKey.includes(bufferCursor.current())) {
        this.children.push(this.createElement(Variable))
        continue
      }

      if (bufferCursor.current() === 0x23) {
        this.children.push(this.createElement(Comment))
        continue
      }

      // this.children.push(this.createElement(None))
      // bufferCursor.forward();
      // continue;

      this.rejectUnexpectedTokenError()
    }

    this.end = bufferCursor.position

    // if (this.bufferCursor.position === 0 && this.bufferCursor.next)

    // while (true) {
    //   const { done, value } = gen.next();
    //   if (done || !value) return;
    //   const [index, current_char, { prev, next }] = value;

    //   if (
    //     (prev(2).equals(Buffer.from([0x23])) && next(2).equals(Buffer.from([0x23, 0x3b]))) ||
    //     (prev(2).equals(Buffer.from([0x0a, 0x23])) && next(2).equals(Buffer.from([0x23, 0x3b])))
    //   ) {
    //     gen.next();
    //     this.children.push(new Code(this.body, index, gen).load());
    //   }


    //   if (prev(2).equals(Buffer.from([0x23])) ||
    //     prev(2).equals(Buffer.from([0x0a, 0x23]))) {
    //     this.children.push(new Comment(this.body, index, gen).load());
    //   }

    //   if (
    //     (
    //       prev(2).length === 1 &&
    //       KeyValue.charactersKey.includes(current_char)
    //     ) ||
    //     (
    //       prev(2).length === 2 &&
    //       prev(2).slice(0, 1).equals(Buffer.from([0x0a])) &&
    //       KeyValue.charactersKey.includes(current_char)
    //     )
    //   ) {
    //     this.children.push(new KeyValue(this.body, index, gen).load());
    //   }
    // }
  }
}
