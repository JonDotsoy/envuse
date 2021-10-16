import { BufferCursor } from "../../lib/buffer-cursor";
import { BCharType } from "../../tdo/b-char-type";
import { b } from "../../lib/to-buffer";
import { StatementObjectTypes } from "../../tdo/statement-object-types";
import { StatementObjectDefinition } from "../statement-object-definition";

export class StatementStrictEqualObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() && b("===").equals(b(bufferCursor.currentAndNext(3)))
    );
  }

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    this.type = StatementObjectTypes.StrictEqualitySymbol;
    bufferCursor.forward(3);
    return;
  }
}
