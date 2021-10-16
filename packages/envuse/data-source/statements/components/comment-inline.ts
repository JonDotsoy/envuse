import { Base } from "./base";
import { BufferCursor } from "../lib/buffer-cursor";
import { BCharType } from "../tdo/b-char-type";
import { BaseSerializeOption } from "../tdo/base-serialize-option";
import { Space } from "./space";
import { charactersKeys } from "../tdo/characters-keys";
import { CharactersKey } from "../tdo/characters-key";

export type CommentType = {
  $type: "Comment";
  value: string;
  [k: string]: any;
};

export class CommentInline extends Base {
  $type = "Comment" as const;

  #valueRaw: number[] = [];

  get value() {
    return Buffer.from(this.#valueRaw).toString();
  }

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    bufferCursor.forward();

    if (bufferCursor.current() === CharactersKey.space) {
      this.createElement(Space);
    }

    while (bufferCursor.has()) {
      if (
        bufferCursor.currentIs(CharactersKey.newLineLF) ||
        bufferCursor.isClosed()
      ) {
        bufferCursor.forward();
        return;
      }

      this.#valueRaw.push(bufferCursor.current());
      bufferCursor.forward();
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value,
    };
  }

  static serialize(comp: CommentType) {
    return Buffer.from(`# ${comp.value}\n`);
  }
}
