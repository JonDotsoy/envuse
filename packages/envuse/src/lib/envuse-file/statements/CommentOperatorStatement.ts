import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";
import { Space } from "./Space";
import { CharactersKey as K } from "./CharactersKey";
import { StatementObject } from "./StatementObject";


export class CommentOperatorStatement extends Base {
  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (true) {
      if (bufferCursor.current() === K.newLineLF || bufferCursor.current() === K.numberSign || bufferCursor.isClosed()) {
        bufferCursor.forward();
        return;
      }

      this.children.push(this.createElement(StatementObject));

      if (bufferCursor.current() === K.newLineLF) {
        bufferCursor.forward()
        return
      }

      if (bufferCursor.current() === K.space) {
        this.createElement(Space);
      }

    }
  }
}
