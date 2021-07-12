import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { BCharType } from "../tdo/BCharType";

export class OperatorStatementVariable extends Base {
  $type = 'OperatorStatementVariable' as const;

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
