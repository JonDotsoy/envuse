import { Base } from "./base";
import { BufferCursor } from "../lib/buffer-cursor";
import { BCharType } from "../tdo/b-char-type";

export class SymbolEqual extends Base {
  $type = "SymbolEqual" as const;

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === 0x3d) {
        this.appendRaw(bufferCursor.current());
        bufferCursor.forward();
        return;
      } else {
        this.rejectUnexpectedTokenError();
      }
    }
  }
}
