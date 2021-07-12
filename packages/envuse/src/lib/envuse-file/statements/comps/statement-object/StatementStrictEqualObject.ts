import { BufferCursor } from "../../lib/BufferCursor";
import { BCharType } from "../../tdo/BCharType";
import {  b } from "../../lib/toBuffer";
import { StatementObjectTypes } from "../../tdo/StatementObjectTypes";
import { StatementObjectDefinition } from "../StatementObjectDefinition";

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
