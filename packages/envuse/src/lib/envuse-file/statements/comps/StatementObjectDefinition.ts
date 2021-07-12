import { BufferCursor } from "../lib/BufferCursor";
import { BCharType } from "../tdo/BCharType";
import { typesValues } from "./typesValues";

export abstract class StatementObjectDefinition {
  type!: typesValues;
  value: any;

  constructor(readonly rejectUnexpectedTokenError: () => never) { }

  abstract assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number>;
  abstract prepare(bufferCursor: BufferCursor<BCharType>): void;
}
