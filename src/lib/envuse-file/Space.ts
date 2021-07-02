import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";

export class Space extends Base {
  prepare(bufferCursor: BufferCursor<number | undefined>): void {
    while (bufferCursor.has()) {
      if ([0x20].includes(bufferCursor.current())) {
        this.appendRaw(bufferCursor.current());
        bufferCursor.forward();
        continue;
      } else {
        this.end = bufferCursor.position
        return;
      }
    }
  }
}

export class SpaceNewLine extends Base {
  prepare(bufferCursor: BufferCursor<number | undefined>): void {
    while (bufferCursor.has()) {
      if ([0x20, 0x0a].includes(bufferCursor.current())) {
        this.appendRaw(bufferCursor.current());
        bufferCursor.forward();
        continue;
      } else {
        this.end = bufferCursor.position
        return;
      }
    }
  }
}
