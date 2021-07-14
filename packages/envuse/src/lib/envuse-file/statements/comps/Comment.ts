import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { BCharType } from "../tdo/BCharType";
import { BaseSerializeOption } from "../tdo/BaseSerializeOption";
import { Space } from "./Space";
import { charactersKeys } from "../tdo/charactersKeys";
import { CharactersKey } from "../tdo/CharactersKey";

export type CommentType = {
  $type: "Comment";
  value: string;
  [k: string]: any;
};

export class Comment extends Base {
  $type = "Comment" as const;

  private valueRaw: number[] = [];

  get value() {
    return Buffer.from(this.valueRaw).toString();
  }

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    bufferCursor.forward();

    if (bufferCursor.current() === CharactersKey.space) {
      this.createElement(Space);
    }

    while (bufferCursor.has()) {
      if (bufferCursor.current() === 0x0a) {
        bufferCursor.forward();
        return;
      }

      this.valueRaw.push(bufferCursor.current());
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
