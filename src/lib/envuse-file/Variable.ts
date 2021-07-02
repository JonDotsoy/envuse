import { Base, BufferCursor } from "./Base";
import { range } from "./range";

export class Variable extends Base {
  prepare(bufferCursor: BufferCursor): void {
    while (bufferCursor.has()) {
      // Break by comment
      if (0x23 === bufferCursor.current()) {
        this.end = bufferCursor.position
        return;
      }
        
      // Break
      if (bufferCursor.current() === 0x0a) {
        bufferCursor.forward();
        this.end = bufferCursor.position
        return;
      }
      this.appendRaw(bufferCursor.current());
      bufferCursor.forward();
    }

    // while (true) {
    //   const { done, value } = gen.next();
    //   if (done || !value) return;
    //   const [index, current_char, { prev, next }] = value;
    //   if (this.raw.length === 0) {
    //     const p = prev(2);
    //     if (p.length == 2) this.appendRaw(p.slice(0, 1))
    //   }
    //   if (KeyValue.charactersKey.includes(current_char)) {
    //     this.appendRaw(current_char)
    //     continue;
    //   }
    //   return;
    // }
  }

  static charactersKey = Buffer.from([
    0x5f,
    0x2d,
    ...Array.from(range(0x61, 0x7a)),
    ...Array.from(range(0x41, 0x5a)),
  ]);
}
