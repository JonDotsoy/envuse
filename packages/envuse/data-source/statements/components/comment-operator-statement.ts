import { Base } from "./base";
import { BufferCursor } from "../lib/buffer-cursor";
import { BCharType } from "../tdo/b-char-type";
import { Space } from "./space";
import { CharactersKey as K } from "../tdo/characters-key";
import { StatementObject, StatementObjectType } from "./statement-object";
import { BaseSerializeOption } from "../tdo/base-serialize-option";

export type CommentOperatorStatementType = {
  $type: "CommentOperatorStatement";
  statements: StatementObjectType[];
};

export class CommentOperatorStatement extends Base {
  $type = "CommentOperatorStatement" as const;
  statements: StatementObject[] = [];

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (true) {
      if (
        bufferCursor.current() === K.newLineLF ||
        bufferCursor.current() === K.numberSign ||
        bufferCursor.isClosed()
      ) {
        bufferCursor.forward();
        return;
      }

      this.statements.push(this.createElement(StatementObject));

      if (bufferCursor.current() === K.newLineLF) {
        bufferCursor.forward();
        return;
      }

      if (bufferCursor.current() === K.space) {
        this.createElement(Space);
      }
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      statements: this.statements,
    };
  }

  static serialize(comp: CommentOperatorStatementType) {
    return Buffer.concat(
      comp.statements.map((s, i, { length }) =>
        Buffer.concat([
          StatementObject.serialize(s),
          Buffer.from(length - 1 === i ? "" : " "),
        ])
      )
    );
  }
}
