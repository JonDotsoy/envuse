import { Base } from "./base";
import { BufferCursor } from "../lib/buffer-cursor";

export type SpaceNewLineType = {
  $type: "SpaceNewLine";
  [k: string]: any;
};

export class SpaceNewLine extends Base {
  $type = "SpaceNewLine" as const;

  prepare(bufferCursor: BufferCursor<number | undefined>): void {
    while (bufferCursor.has()) {
      if ([0x20, 0x0a].includes(bufferCursor.current())) {
        this.appendRaw(bufferCursor.current());
        bufferCursor.forward();
        continue;
      } else {
        return;
      }
    }
  }
}
