import { BufferCursor } from "../../lib/buffer-cursor";
import { BCharType } from "../../tdo/b-char-type";
import { CharactersKey as k } from "../../tdo/characters-key";
import { b } from "../../lib/to-buffer";
import { StatementObjectTypes } from "../../tdo/statement-object-types";
import { StatementObjectDefinition } from "../statement-object-definition";

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

    while (bufferCursor.hasOrEnd()) {
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
            if (bufferCursor.has()) appendRaw(bufferCursor.current());
            bufferCursor.forward();
            continue;
          }
        }
      }
      if (bufferCursor.has()) appendRaw(bufferCursor.current());
      bufferCursor.forward();
    }
  }
}
