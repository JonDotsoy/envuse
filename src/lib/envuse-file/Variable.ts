import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";
import { range } from "./range";
import { Space, SpaceNewLine } from "./Space";

class SymboEqual extends Base {
  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === 0x3d) {
        this.appendRaw(bufferCursor.current())
        bufferCursor.forward()
        this.end = bufferCursor.position
        return
      } else {
        this.rejectUnexpectedTokenError()
      }
    }
  }
}


const charactersKey = Buffer.from([
  0x5f,
  0x2d,
  ...Array.from(range(0x61, 0x7a)),
  ...Array.from(range(0x41, 0x5a)),
]);


export class KeyVariable extends Base {
  prepare(bufferCursor: BufferCursor): void {
    while (bufferCursor.has()) {
      if (charactersKey.includes(bufferCursor.current())) {
        this.appendRaw(bufferCursor.current())
        bufferCursor.forward()
        continue
      } else {
        this.end = bufferCursor.position
        return
      }
    }
  }
}

export class ValueVariable extends Base {
  prepare(bufferCursor: BufferCursor): void {
    while (bufferCursor.has()) {
      if (charactersKey.includes(bufferCursor.current())) {
        this.appendRaw(bufferCursor.current())
        bufferCursor.forward()
        continue
      } else {
        this.end = bufferCursor.position
        return
      }
    }
  }
}


export class Variable extends Base {
  keyVariable!: KeyVariable;
  valueVariable!: ValueVariable;

  prepare(bufferCursor: BufferCursor): void {
    const keyVariable = this.createElement(KeyVariable);
    this.keyVariable = keyVariable;
    this.children.push(keyVariable)

    if (bufferCursor.current() === 0x20) {
      this.children.push(this.createElement(Space))
    }

    this.children.push(this.createElement(SymboEqual))

    if (bufferCursor.current() === 0x20) {
      this.children.push(this.createElement(Space))
    }

    const valueVariable = this.createElement(ValueVariable)
    this.valueVariable = valueVariable;
    this.children.push(valueVariable);

    return;

    // bufferCursor.forward()

    // while (bufferCursor.has()) {
    //   // Break by comment
    //   if (0x23 === bufferCursor.current()) {
    //     this.end = bufferCursor.position
    //     return;
    //   }

    //   // Break
    //   if (bufferCursor.current() === 0x0a) {
    //     bufferCursor.forward();
    //     this.end = bufferCursor.position
    //     return;
    //   }
    //   this.appendRaw(bufferCursor.current());
    //   bufferCursor.forward();
    // }

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

  static charactersKey = charactersKey;
}
