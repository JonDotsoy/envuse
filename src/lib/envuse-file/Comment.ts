import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";
import { Iter } from "./Iter";


export class Comment extends Base {
  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === 0x0a) {
        this.end = bufferCursor.position
        bufferCursor.forward();
        return;
      }
      
      this.appendRaw(bufferCursor.current());
      bufferCursor.forward();
    }
  }

  // prepare() {
    // while (true) {
    //   const { done, value } = gen.next();
    //   if (done || !value)
    //     return;
    //   const [, current_char, { next }] = value;
    //   this.appendRaw(current_char);
    //   if (
    //     current_char.equals(Buffer.from([0x0a]))
    //   ) {
    //     if (next(2).equals(Buffer.from([0x0a, 0x23]))) {
    //       gen.next()
    //       continue;
    //     }
    //     return;
    //   }
    // }
  // }
}
