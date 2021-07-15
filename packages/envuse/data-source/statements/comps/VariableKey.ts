import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { charactersKeys } from "../tdo/charactersKeys";
import { BaseSerializeOption } from "../tdo/BaseSerializeOption";

export type VariableKeyType = {
  $type: "VariableKey";
  value: string;
  [k: string]: any;
};

export class VariableKey extends Base {
  $type = "VariableKey" as const;
  value!: string;

  prepare(bufferCursor: BufferCursor): void {
    while (bufferCursor.has()) {
      if (charactersKeys.includes(bufferCursor.current())) {
        this.appendRaw(bufferCursor.current());
        this.value = this.raw.toString();
        bufferCursor.forward();
        continue;
      } else {
        return;
      }
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value,
    };
  }

  static serialize(comp: VariableKeyType) {
    return Buffer.from(comp.value);
  }
}
