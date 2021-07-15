import { BufferCursor } from "../lib/BufferCursor";
import { BaseSerializeOption } from "../tdo/BaseSerializeOption";
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
    const valueWithQuotationMark =
      firsCharacter === 0x22 ? 0x22 : firsCharacter === 0x27 ? 0x27 : null;

    if (valueWithQuotationMark) {
      bufferCursor.forward();
    }

    while (bufferCursor.has()) {
      if (
        bufferCursor.current() === 0x23 &&
        valueWithQuotationMark === undefined
      ) {
        return;
      }

      if (bufferCursor.current() === 0x0a) {
        bufferCursor.forward();
        return;
      }

      if (
        bufferCursor.current() === valueWithQuotationMark &&
        bufferCursor.prev(1)[0] !== 0x5c
      ) {
        bufferCursor.forward();
        return;
      }

      this.appendRaw(bufferCursor.current());
      bufferCursor.forward();
      continue;
    }
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
