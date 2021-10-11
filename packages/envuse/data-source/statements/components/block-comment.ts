import { ArrCursor, Validator } from "../lib/arr-cursor";
import { BufferCursor } from "../lib/buffer-cursor";
import { CharactersKey } from "../tdo/characters-key";
import { TypeNamesList } from "../tdo/type-names-list";
import { Base } from "./base";

export type BlockCommentType = {
  $type: "BlockComment";
  value: string;
  [k: string]: any;
};

export class BlockComment extends Base {
  $type = "BlockComment" as const;
  buff: number[] = [];

  get value(): string {
    return this.body.slice(this.pos, this.end).toString();
  }

  prepare(bufferCursor: BufferCursor): void {
    bufferCursor.forward(3);

    const validatorSpaceOrNewLine: Validator<BufferCursor> = (
      cursor,
      actions
    ) => {
      cursor.forward();

      if (cursor.current() === CharactersKey.space) {
        while (cursor.current() === CharactersKey.space) {
          cursor.forward();
        }
      }

      if (cursor.current() === CharactersKey.newLineLF) return actions.continue;
    };

    while (bufferCursor.has()) {
      let matched;
      if (
        bufferCursor.isClosed() ||
        (Buffer.from(Array(3).fill(CharactersKey.numberSign)).equals(
          Buffer.from(bufferCursor.currentAndPrev(3))
        ) &&
          (([matched] = bufferCursor.clone().match(validatorSpaceOrNewLine)),
          matched))
      ) {
        bufferCursor.forward();
        return;
      }

      this.buff.push(bufferCursor.current());
      bufferCursor.forward();
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      // value: this.value,
    };
  }

  static serialize(blockComment: BlockCommentType) {
    return Buffer.concat([Buffer.from(blockComment.value), Buffer.from("\n")]);
  }
}
