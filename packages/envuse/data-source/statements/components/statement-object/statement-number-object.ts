import { BufferCursor } from "../../lib/buffer-cursor";
import { BCharType } from "../../tdo/b-char-type";
import { CharactersKey as k } from "../../tdo/characters-key";
import { b } from "../../lib/to-buffer";
import { StatementObjectTypes } from "../../tdo/statement-object-types";
import { StatementObjectDefinition } from "../statement-object-definition";

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
    while (bufferCursor.hasOrEnd()) {
      if (
        bufferCursor.isClosed() ||
        k.space === bufferCursor.current() ||
        bufferCursor.current() === k.newLineLF ||
        bufferCursor.current() === k.equalsSign
      ) {
        this.value = Number(b(raw));
        return;
      }
      if (
        bufferCursor.has() &&
        (k.numbers.includes(bufferCursor.current()) ||
          bufferCursor.current() === k.dot)
      ) {
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
