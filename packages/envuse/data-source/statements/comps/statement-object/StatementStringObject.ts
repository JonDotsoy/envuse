import { BufferCursor } from "../../lib/BufferCursor";
import { BCharType } from "../../tdo/BCharType";
import { CharactersKey as k } from "../../tdo/CharactersKey";
import { b } from "../../lib/toBuffer";
import { StatementObjectTypes } from "../../tdo/StatementObjectTypes";
import { StatementObjectDefinition } from "../StatementObjectDefinition";

export class StatementStringObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() &&
      (k.doubleQuotes === bufferCursor.current() ||
        k.singleQuote === bufferCursor.current())
    );
  }

  prepare(bufferCursor: BufferCursor<number>): void {
    const raw: number[] = [];
    const appendRaw = (...chars: number[]) => {
      raw.push(...chars);
    };

    this.type = StatementObjectTypes.String;
    const initialQuote = bufferCursor.current();
    bufferCursor.forward();

    while (bufferCursor.has()) {
      const p = bufferCursor.prev(2);
      if (
        bufferCursor.isClosed() ||
        initialQuote === bufferCursor.current() ||
        bufferCursor.current() === k.newLineLF
      ) {
        bufferCursor.forward();
        this.value = String(b(raw));
        return;
      }

      if (bufferCursor.current() == k.backslash) {
        bufferCursor.forward();
        switch (bufferCursor.current()) {
          case 0x74: {
            appendRaw(k.horizontalTab);
            bufferCursor.forward();
            continue;
          }
          case 0x6e: {
            appendRaw(k.newLineLF);
            bufferCursor.forward();
            continue;
          }
          default: {
            appendRaw(bufferCursor.current());
            bufferCursor.forward();
            continue;
          }
        }
      }

      appendRaw(bufferCursor.current());
      bufferCursor.forward();
    }
  }
}
