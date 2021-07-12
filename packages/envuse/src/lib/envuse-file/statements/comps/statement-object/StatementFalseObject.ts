import { BufferCursor } from "../../lib/BufferCursor";
import { BCharType } from "../../tdo/BCharType";
import { b } from "../../lib/toBuffer";
import { StatementObjectTypes } from "../../tdo/StatementObjectTypes";
import { StatementObjectDefinition } from "../StatementObjectDefinition";

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
