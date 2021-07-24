import { BufferCursor } from "../lib/BufferCursor";
import { CharactersKey } from "../tdo/CharactersKey";
import { Base } from "./Base";

export class SymbolColon extends Base {
  $type = "SymbolColon" as const;

  prepare(bufferCursor: BufferCursor<number>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === CharactersKey.colon) {
        this.appendRaw(bufferCursor.current());
        bufferCursor.forward();
        return;
      } else {
        this.rejectUnexpectedTokenError();
      }
    }
  }
}