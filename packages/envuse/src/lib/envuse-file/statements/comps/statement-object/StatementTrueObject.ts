import { BufferCursor } from "../../lib/BufferCursor";
import { BCharType } from "../../tdo/BCharType";
import { toBuffer as b } from "../../lib/toBuffer";
import { StatementObjectTypes } from "../../tdo/StatementObjectTypes";
import { StatementObjectDefinition } from "../StatementObjectDefinition";

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
