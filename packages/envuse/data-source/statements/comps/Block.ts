import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { Comment, CommentType } from "./Comment";
import { CommentOperator, CommentOperatorType } from "./CommentOperator";
import { Variable, VariableType } from "./Variable";
import { SpaceNewLine, SpaceNewLineType } from "./SpaceNewLine";
import { CharactersKey } from "../tdo/CharactersKey";
import { BlockComment, BlockCommentType } from "./BlockComment";

export type BlockType = {
  $type: "Block";
  children: (
    | SpaceNewLineType
    | VariableType
    | CommentOperatorType
    | CommentType
    | BlockCommentType
  )[];
  [k: string]: any;
};

export class Block extends Base {
  $type = "Block" as const;

  children: (SpaceNewLine | Variable | CommentOperator | Comment | BlockComment)[] = [];
  propsMutable!: "handleCheckCloseBlock";

  prepare(bufferCursor: BufferCursor) {
    while (bufferCursor.has()) {
      if (this.handleCheckCloseBlock) {
        const requireClose = this.handleCheckCloseBlock.call(
          this,
          bufferCursor
        );
        if (requireClose) {
          break;
        }
      }

      if (this.intent(bufferCursor)) {
        continue;
      }

      this.rejectUnexpectedTokenError();
    }
  }

  intent(bufferCursor: BufferCursor<number>) {
    // console.log(bufferCursor.position, bufferCursor.current(), JSON.stringify(Buffer.from([bufferCursor.current() ?? 0]).toString()))

    // Push a SpaceNewLine
    if (bufferCursor.has() && [0x20, 0x0a].includes(bufferCursor.current())) {
      this.children.push(this.createElement(SpaceNewLine));
      return true;
    }

    // Push a Variable
    if (
      bufferCursor.has() &&
      Variable.charactersKey.includes(bufferCursor.current())
    ) {
      this.children.push(this.createElement(Variable));
      return true;
    }

    // Push a BlockComment
    if (
      bufferCursor.has() &&
      Buffer.from(Array(3).fill(CharactersKey.numberSign)).equals(Buffer.from(bufferCursor.currentAndNext(3)))
    ) {
      this.children.push(this.createElement(BlockComment));
      return true;
    }

    // Push a CommentOperator
    if (bufferCursor.current() === 0x23 && bufferCursor.next(1)[0] === 0x3b) {
      this.children.push(this.createElement(CommentOperator));
      return true;
    }

    // Push a Comment
    if (bufferCursor.current() === 0x23) {
      this.children.push(this.createElement(Comment));
      return true;
    }

    return false;
  }

  handleCheckCloseBlock?: (
    this: Base,
    bufferCursor: BufferCursor<number>
  ) => boolean;

  toJSON() {
    return {
      ...super.toJSON(),
    };
  }

  static serialize(comp: BlockType) {
    const buff: Buffer[] = comp.children.map((child) => {
      switch (child.$type) {
        case "SpaceNewLine":
          return Buffer.from([]);
        case "CommentOperator":
          return CommentOperator.serialize(child);
        case "Comment":
          return Comment.serialize(child);
        case "Variable":
          return Variable.serialize(child);
        default: {
          // @ts-ignore
          throw new Error(`type unsupported ${child.$type}`);
        }
      }
    });

    return Buffer.concat(buff);
  }
}
