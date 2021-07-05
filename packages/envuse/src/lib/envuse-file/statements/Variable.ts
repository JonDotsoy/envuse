import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";
import { Space, SpaceNewLine } from "./Space";
import { CharactersKey } from "./CharactersKey";

class SymboEqual extends Base {
  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === 0x3d) {
        this.appendRaw(bufferCursor.current())
        bufferCursor.forward()
        return
      } else {
        this.rejectUnexpectedTokenError()
      }
    }
  }
}

const charactersKeys = Buffer.from([
  CharactersKey.underscore,
  CharactersKey.hyphenMinus,
  ...CharactersKey.english_alphabet_lower,
  ...CharactersKey.english_alphabet_upper,
]);


export class VariableKey extends Base {
  prepare(bufferCursor: BufferCursor): void {
    while (bufferCursor.has()) {
      if (charactersKeys.includes(bufferCursor.current())) {
        this.appendRaw(bufferCursor.current())
        bufferCursor.forward()
        continue
      } else {
        return
      }
    }
  }
}

export class VariableValue extends Base {
  prepare(bufferCursor: BufferCursor): void {
    const firsCharacter = bufferCursor.current()
    const valueWithQuotationMark = firsCharacter === 0x22 ? 0x22 : firsCharacter === 0x27 ? 0x27 : null

    if (valueWithQuotationMark) {
      bufferCursor.forward()
    }

    while (bufferCursor.has()) {
      if (bufferCursor.current() === 0x23 && valueWithQuotationMark === undefined) {
        return
      }

      if (bufferCursor.current() === 0x0a) {
        bufferCursor.forward()
        return
      }

      if (bufferCursor.current() === valueWithQuotationMark && bufferCursor.prev(1)[0] !== 0x5c) {
        bufferCursor.forward()
        return
      }

      this.appendRaw(bufferCursor.current())
      bufferCursor.forward()
      continue
    }
  }
}


export class Variable extends Base {
  keyVariable!: VariableKey;
  valueVariable!: VariableValue;

  prepare(bufferCursor: BufferCursor): void {
    const keyVariable = this.createElement(VariableKey);
    this.keyVariable = keyVariable;
    this.children.push(keyVariable)

    if (bufferCursor.current() === 0x20) {
      this.children.push(this.createElement(Space))
    }

    this.children.push(this.createElement(SymboEqual))

    if (bufferCursor.current() === 0x20) {
      this.children.push(this.createElement(Space))
    }

    const valueVariable = this.createElement(VariableValue)
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

  static charactersKey = charactersKeys;
}
