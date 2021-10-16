import { BufferCursor } from "../../lib/buffer-cursor";
import { BCharType } from "../../tdo/b-char-type";
import { b } from "../../lib/to-buffer";
import { StatementObjectTypes } from "../../tdo/statement-object-types";
import { StatementObjectDefinition } from "../statement-object-definition";

export class StatementTrueObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() && b("true").equals(b(bufferCursor.currentAndNext(4)))
    );
  }

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    this.type = StatementObjectTypes.Boolean;
    this.value = true;
    bufferCursor.forward(4);
    return;
  }
}
