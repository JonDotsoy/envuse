import { BufferCursor } from "../lib/buffer-cursor";
import { CharactersKey } from "../tdo/characters-key";
import { Base } from "./base";

export type SymbolExclamationMarkType = {
  $type: "SymbolExclamationMark";
  [k: string]: any;
};

export class SymbolExclamationMark extends Base {
  $type = "SymbolExclamationMark" as const;

  prepare(bufferCursor: BufferCursor<number>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === CharactersKey.exclamationMark) {
        this.appendRaw(bufferCursor.current());
        bufferCursor.forward();
        return;
      } else {
        this.rejectUnexpectedTokenError();
      }
    }
  }

  static serialize(comp: SymbolExclamationMarkType) {
    return Buffer.from(":");
  }
}
