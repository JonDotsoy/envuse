import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";
import { Space } from "./Space";
import { VariableKey } from "./Variable";
import { Block } from "./Root";
import { range } from "./range";
import { CharactersKey as K } from "./CharactersKey";
import { toBuffer as b } from "./toBuffer";


const charactersKeyVariableName = Buffer.from([

]);

export class OperatorStatementVariable extends Base {
  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === 0x0a || bufferCursor.current() === 0x23) {
        this.end = bufferCursor.position;
        bufferCursor.forward();
        return;
      }

      this.appendRaw(bufferCursor.current());
      bufferCursor.forward();
    }
  }
}

const types = {
  Boolean: Symbol('StatementObject.types.Boolean'),
  Number: Symbol('StatementObject.types.Number'),
  StrictEquality: Symbol('StatementObject.types.StrictEquality'),
}

export class StatementObject extends Base {
  static types = types

  type!: symbol
  value: any

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    if (bufferCursor.has()) {
      // console.log(b(K.numbers).toString(), b([bufferCursor.current()]).toString(), K.numbers.includes(bufferCursor.current()))

      if (K.numbers.includes(bufferCursor.current())) {
        this.type = types.Number
        while (true) {
          if (K.space === bufferCursor.current()) {
            bufferCursor.forward()
            this.end = bufferCursor.position
            this.value = Number(this.raw)
            return
          }
          if (K.numbers.includes(bufferCursor.current()) || bufferCursor.current() === K.dot) {
            this.appendRaw(bufferCursor.current())
            bufferCursor.forward()
            continue
          }
          if (bufferCursor.current() === K.underscore) {
            bufferCursor.forward()
            continue
          }
          this.rejectUnexpectedTokenError()
        }
      }

      if (b('true').equals(b(bufferCursor.currentAndNext(4)))) {
        this.type = types.Boolean
        this.value = true
        bufferCursor.forward(5)
        return
      }

      if (b('false').equals(b(bufferCursor.currentAndNext(5)))) {
        this.type = types.Boolean
        this.value = false
        bufferCursor.forward(6)
        return
      }

      if (b('===').equals(b(bufferCursor.currentAndNext(3)))) {
        this.type = types.StrictEquality
        bufferCursor.forward(4)
        return
      }
    }

    this.rejectUnexpectedTokenError()
    // while (bufferCursor.has()) {
    //   if (bufferCursor.current() === K.space) {
    //     this.end = bufferCursor.position;
    //     bufferCursor.forward();
    //     return;
    //   }
    //   this.appendRaw(bufferCursor.current());
    //   bufferCursor.forward();
    // }
  }
}

export class CommentOperatorStatement extends Base {
  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === K.newLineLF || bufferCursor.current() === K.numberSign) {
        this.end = bufferCursor.position;
        bufferCursor.forward();
        return;
      }

      this.children.push(this.createElement(StatementObject));

      if (bufferCursor.current() === K.space) {
        this.createElement(Space)
      }

      // this.appendRaw(bufferCursor.current());
      // bufferCursor.forward();
    }
  }
}


export class CommentOperator extends Base {
  operator!: VariableKey;
  statement!: CommentOperatorStatement;
  block!: Block;

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    bufferCursor.forward(2)

    if (bufferCursor.current() === 0x20) this.createElement(Space)

    this.operator = this.createElement(VariableKey)

    switch (this.operator.raw.toString()) {
      case 'if': break;
      case 'fi': break;
      default: {
        bufferCursor.backward(this.operator.raw.length);
        this.rejectUnexpectedTokenError();
      }
    }

    if (this.operator.raw.equals(Buffer.from('fi'))) {
      return;
    }

    this.createElement(Space)

    this.statement = this.createElement(CommentOperatorStatement)

    this.block = this.createElement(Block, {
      handleCheckCloseBlock() {
        const lastChild = this.children[this.children.length - 1]
        if (lastChild instanceof CommentOperator && lastChild.operator.raw.equals(Buffer.from('fi'))) {
          return true;
        }
        return false;
      }
    })
  }
}
