import { Base } from "./base";
import { BufferCursor } from "../lib/buffer-cursor";
import { CharactersKey as K } from "../tdo/characters-key";

export type SpaceType = {
  $type: "Space";
  [k: string]: any;
};

export class Space extends Base {
  $type = "Space" as const;

  prepare(bufferCursor: BufferCursor<number | undefined>): void {
    if (K.space !== bufferCursor.current()) {
      this.rejectUnexpectedTokenError();
    }
    while (bufferCursor.has()) {
      if ([0x20].includes(bufferCursor.current())) {
        this.appendRaw(bufferCursor.current());
        bufferCursor.forward();
        continue;
      } else {
        return;
      }
    }
  }
}
