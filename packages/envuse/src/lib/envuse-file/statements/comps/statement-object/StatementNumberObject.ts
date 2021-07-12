import { BufferCursor } from "../../lib/BufferCursor";
import { BCharType } from "../../tdo/BCharType";
import { CharactersKey as k } from "../../tdo/CharactersKey";
import { toBuffer as b } from "../../lib/toBuffer";
import { StatementObjectTypes } from "../../tdo/StatementObjectTypes";
import { StatementObjectDefinition } from "../StatementObjectDefinition";

export class StatementNumberObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return bufferCursor.has() && k.numbers.includes(bufferCursor.current());
  }

  prepare(bufferCursor: BufferCursor<number>): void {
    const raw: number[] = [];
    const appendRaw = (...chars: number[]) => {
      raw.push(...chars);
    };

    this.type = StatementObjectTypes.Number;
    while (bufferCursor.has()) {
      if (bufferCursor.isClosed() ||
        k.space === bufferCursor.current() ||
        bufferCursor.current() === k.newLineLF ||
        bufferCursor.current() === k.equalsSign) {
        this.value = Number(b(raw));
        return;
      }
      if (k.numbers.includes(bufferCursor.current()) ||
        bufferCursor.current() === k.dot) {
        appendRaw(bufferCursor.current());
        bufferCursor.forward();
        continue;
      }
      if (bufferCursor.current() === k.underscore) {
        bufferCursor.forward();
        continue;
      }
      this.rejectUnexpectedTokenError();
    }
  }
}
