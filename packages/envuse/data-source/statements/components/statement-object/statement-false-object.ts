import { BufferCursor } from "../../lib/buffer-cursor";
import { BCharType } from "../../tdo/b-char-type";
import { b } from "../../lib/to-buffer";
import { StatementObjectTypes } from "../../tdo/statement-object-types";
import { StatementObjectDefinition } from "../statement-object-definition";

export class StatementFalseObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() && b("false").equals(b(bufferCursor.currentAndNext(5)))
    );
  }

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    this.type = StatementObjectTypes.Boolean;
    this.value = false;
    bufferCursor.forward(5);
    return;
  }
}
