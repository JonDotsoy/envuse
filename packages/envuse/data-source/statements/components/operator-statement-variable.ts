import { Base } from "./base";
import { BufferCursor } from "../lib/buffer-cursor";
import { BCharType } from "../tdo/b-char-type";

export class OperatorStatementVariable extends Base {
  $type = "OperatorStatementVariable" as const;

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === 0x0a || bufferCursor.current() === 0x23) {
        bufferCursor.forward();
        return;
      }

      this.appendRaw(bufferCursor.current());
      bufferCursor.forward();
    }
  }
}
