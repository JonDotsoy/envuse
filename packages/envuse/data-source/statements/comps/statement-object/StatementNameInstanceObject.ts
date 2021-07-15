import { BufferCursor } from "../../lib/BufferCursor";
import { BCharType } from "../../tdo/BCharType";
import { CharactersKey as k } from "../../tdo/CharactersKey";
import { b as toBuffer } from "../../lib/toBuffer";
import { StatementObjectTypes } from "../../tdo/StatementObjectTypes";
import { StatementObjectDefinition } from "../StatementObjectDefinition";

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

    while (bufferCursor.has()) {
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
        StatementNameInstanceObject.characterKeyAccept.includes(
          bufferCursor.current()
        ) ||
        k.underscore === bufferCursor.current() ||
        k.numbers.includes(bufferCursor.current())
      ) {
        charAccumulation.push(bufferCursor.current());
        bufferCursor.forward();
        continue;
      }

      this.rejectUnexpectedTokenError();
    }
  }
}
