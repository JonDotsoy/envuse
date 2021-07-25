import { Validator } from "../lib/ArrCursor";
import { BufferCursor } from "../lib/BufferCursor";
import { CharactersKey } from "../tdo/CharactersKey";
import { Base } from "./Base";

export type VariableValueType = {
  $type: "VariableValue";
  value: string;
  [k: string]: any;
};

export class VariableValue extends Base {
  $type = "VariableValue" as const;

  get value() {
    return this.raw.toString();
  }

  prepare(bufferCursor: BufferCursor): void {
    const firsCharacter = bufferCursor.current();
    const valueWithQuotationMark = firsCharacter === 0x22
      ? 0x22
      : firsCharacter === 0x27
        ? 0x27
        : null;

    if (valueWithQuotationMark) {
      bufferCursor.forward();

      while (bufferCursor.has()) {
        if (bufferCursor.isClosed()) return

        if (bufferCursor.current() === CharactersKey.backslash) {
          bufferCursor.forward()
          this.appendRaw(bufferCursor.current())
          bufferCursor.forward()
          continue
        }

        if (bufferCursor.current() === valueWithQuotationMark) {
          bufferCursor.forward()
          return
        }

        if (bufferCursor.current() === CharactersKey.newLineLF) {
          this.rejectUnexpectedTokenError()
        }

        this.appendRaw(bufferCursor.current())
        bufferCursor.forward()
        continue
      }

      this.rejectUnexpectedTokenError()
    }

    const validatorPrevToNumberSign: Validator<typeof bufferCursor> = (cursor, actions) => {
      if (cursor.current() === CharactersKey.space) {
        while (cursor.has()) {
          if (cursor.current() !== CharactersKey.space) {
            break
          }
          cursor.forward()
        }
        if (cursor.current() === CharactersKey.numberSign) {
          return actions.breakSuccess
        }
      }
    }

    while (bufferCursor.has()) {
      let matched;
      if (
        bufferCursor.isClosed() ||
        bufferCursor.current() === CharactersKey.newLineLF ||
        bufferCursor.current() === CharactersKey.numberSign ||
        ([matched] = bufferCursor.clone().match(validatorPrevToNumberSign), matched)
      ) {
        return
      }

      this.appendRaw(bufferCursor.current())
      bufferCursor.forward()
      continue
    }

    // while (bufferCursor.has()) {
    //   if (
    //     bufferCursor.current() === 0x23 &&
    //     valueWithQuotationMark === undefined
    //   ) {
    //     return;
    //   }

    //   if (bufferCursor.current() === 0x0a) {
    //     bufferCursor.forward();
    //     return;
    //   }

    //   if (
    //     bufferCursor.current() === valueWithQuotationMark &&
    //     bufferCursor.prev(1)[0] !== 0x5c
    //   ) {
    //     bufferCursor.forward();
    //     return;
    //   }

    //   this.appendRaw(bufferCursor.current());
    //   bufferCursor.forward();
    //   continue;
    // }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value,
    };
  }

  static serialize(comp: VariableValueType) {
    return Buffer.from(`${JSON.stringify(comp.value)}`);
  }
}
