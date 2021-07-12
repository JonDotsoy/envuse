import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";


export type SpaceNewLineType = {
  $type: 'SpaceNewLine'
  [k: string]: any
}


export class SpaceNewLine extends Base  {
  $type = 'SpaceNewLine' as const;

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
