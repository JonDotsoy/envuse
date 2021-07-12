import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { charactersKeys } from "../tdo/charactersKeys";


export class VariableKey extends Base {
  $type = 'VariableKey' as const;
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
    }
  }
}
