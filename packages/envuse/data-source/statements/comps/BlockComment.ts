import { ArrCursor, Validator } from "../lib/ArrCursor";
import { BufferCursor } from "../lib/BufferCursor";
import { CharactersKey } from "../tdo/CharactersKey";
import { TypeNamesList } from "../tdo/TypeNamesList";
import { Base } from "./Base";

export type BlockCommentType = {
  $type: "BlockComment";
  // value: string;
  [k: string]: any;
};

export class BlockComment extends Base {
  $type = "BlockComment" as const;
  buff: number[] = [];

  prepare(bufferCursor: BufferCursor): void {
    bufferCursor.forward(3);

    const validatorSpaceOrNewLine: Validator<BufferCursor> = (
      cursor,
      actions
    ) => {
      cursor.forward()

      if (cursor.current() === CharactersKey.space) {
        while (cursor.current() === CharactersKey.space) {
          cursor.forward()
        }
      }

      if (cursor.current() === CharactersKey.newLineLF) return actions.continue;
    };

    while (bufferCursor.has()) {
      let matched;
      if (
        bufferCursor.isClosed() ||
        (
          Buffer.from(Array(3).fill(CharactersKey.numberSign)).equals(Buffer.from(bufferCursor.currentAndPrev(3))) &&
          (([matched] = bufferCursor.clone().match(validatorSpaceOrNewLine)), matched)
        )
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
}
