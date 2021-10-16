import { BufferCursor } from "../lib/buffer-cursor";
import { BCharType } from "../tdo/b-char-type";
import { typesValues } from "./types-values";

export abstract class StatementObjectDefinition {
  type!: typesValues;
  value: any;

  constructor(readonly rejectUnexpectedTokenError: () => never) {}

  abstract assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number>;
  abstract prepare(bufferCursor: BufferCursor<BCharType>): void;
}
