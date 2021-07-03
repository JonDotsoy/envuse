import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";


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
}
