import { Validator } from "../lib/ArrCursor";
import { BufferCursor } from "../lib/BufferCursor";
import { CharactersKey as k } from "../tdo/CharactersKey";
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

        if (bufferCursor.current() === k.backslash) {
          bufferCursor.forward()
          switch (bufferCursor.current()) {

            // parse \n
            case 0x6E: this.appendRaw(k.newLineLF); break;
            // parse \r
            case 0x72: this.appendRaw(k.carriageReturn); break;
            // parse \t
            case 0x74: this.appendRaw(k.tab); break;
            // parse \v
            case 0x76: this.appendRaw(k.verticalTab); break;
            // parse \f
            case 0x66: this.appendRaw(k.formFeed); break;
            // parse \b
            case 0x62: this.appendRaw(k.backspace); break;
            // parse \\
            case 0x5C: this.appendRaw(k.backslash); break;
            // parse \"
            case 0x22: this.appendRaw(k.doubleQuotes); break;
            // parse \'
            case 0x27: this.appendRaw(k.singleQuote); break;

            default: this.appendRaw(bufferCursor.current()); break;
          }
          bufferCursor.forward()
          continue
        }

        if (bufferCursor.current() === valueWithQuotationMark) {
          bufferCursor.forward()
          return
        }

        if (bufferCursor.current() === k.newLineLF) {
          this.rejectUnexpectedTokenError()
        }

        this.appendRaw(bufferCursor.current())
        bufferCursor.forward()
        continue
      }

      this.rejectUnexpectedTokenError()
    }

    const validatorPrevToNumberSign: Validator<typeof bufferCursor> = (cursor, actions) => {
      if (cursor.current() === k.space) {
        while (cursor.has()) {
          if (cursor.current() !== k.space) {
            break
          }
          cursor.forward()
        }
        if (cursor.current() === k.numberSign) {
          return actions.breakSuccess
        }
      }
    }

    while (bufferCursor.has()) {
      let matched;
      if (
        bufferCursor.isClosed() ||
        bufferCursor.current() === k.newLineLF ||
        bufferCursor.current() === k.numberSign ||
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
