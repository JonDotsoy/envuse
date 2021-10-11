import { BufferCursor } from "../lib/buffer-cursor";
import { CharactersKey } from "../tdo/characters-key";
import { Base } from "./base";

export type SymbolColonType = {
  $type: "SymbolColon";
  [k: string]: any;
};

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

  static serialize(comp: SymbolColonType) {
    return Buffer.from(":");
  }
}
