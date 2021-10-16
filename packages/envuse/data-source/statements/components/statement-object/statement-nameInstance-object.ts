import { BufferCursor } from "../../lib/buffer-cursor";
import { BCharType } from "../../tdo/b-char-type";
import { CharactersKey as k } from "../../tdo/characters-key";
import { b as toBuffer } from "../../lib/to-buffer";
import { StatementObjectTypes } from "../../tdo/statement-object-types";
import { StatementObjectDefinition } from "../statement-object-definition";

export class StatementNameInstanceObject extends StatementObjectDefinition {
  static characterKeyAccept = [...k.english_alphabet, k.dollarSign];

  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() &&
      StatementNameInstanceObject.characterKeyAccept.includes(
        bufferCursor.current()
      )
    );
  }

  prepare(bufferCursor: BufferCursor<number>): void {
    this.type = StatementObjectTypes.NameInstance;
    let partialPath: string[] = [];
    let charAccumulation: number[] = [];

    while (bufferCursor.hasOrEnd()) {
      if (
        bufferCursor.isClosed() ||
        bufferCursor.current() === k.space ||
        bufferCursor.current() === k.newLineLF
      ) {
        partialPath.push(toBuffer(charAccumulation).toString());
        this.value = partialPath;
        // bufferCursor.forward();
        return;
      }

      if (bufferCursor.current() === k.dot) {
        partialPath.push(toBuffer(charAccumulation).toString());
        charAccumulation = [];
        bufferCursor.forward();
        continue;
      }

      if (
        bufferCursor.has() &&
        (StatementNameInstanceObject.characterKeyAccept.includes(
          bufferCursor.current()
        ) ||
          k.underscore === bufferCursor.current() ||
          k.numbers.includes(bufferCursor.current()))
      ) {
        charAccumulation.push(bufferCursor.current());
        bufferCursor.forward();
        continue;
      }

      this.rejectUnexpectedTokenError();
    }
  }
}
