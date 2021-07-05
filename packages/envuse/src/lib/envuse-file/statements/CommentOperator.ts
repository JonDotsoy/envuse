import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";
import { Space } from "./Space";
import { VariableKey } from "./Variable";
import { Block } from "./Root";
import { range } from "./range";
import { CharactersKey as K } from "./CharactersKey";
import { toBuffer as b, toBuffer } from "./toBuffer";


const charactersKeyVariableName = Buffer.from([

]);

export class OperatorStatementVariable extends Base {
  prepare(bufferCursor: BufferCursor<BCharType>): void {
    while (bufferCursor.has()) {
      if (bufferCursor.current() === 0x0a || bufferCursor.current() === 0x23) {
        bufferCursor.forward();
        return;
      }

      this.appendRaw(bufferCursor.current());
      bufferCursor.forward();
    }
  }
}

const types = {
  Boolean: 'Boolean',
  Number: 'Number',
  String: 'String',
  NameInstance: 'NameInstance',
  StrictEquality: 'StrictEquality',
} as const


export class StatementObject extends Base {
  static types = types

  type!: string
  value: any

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    if (bufferCursor.has()) {
      // console.log(b([bufferCursor.current()]).toString())

      if (b('true').equals(b(bufferCursor.currentAndNext(4)))) {
        this.type = types.Boolean
        this.value = true
        bufferCursor.forward(4)
        return
      }

      if (b('false').equals(b(bufferCursor.currentAndNext(5)))) {
        this.type = types.Boolean
        this.value = false
        bufferCursor.forward(5)
        return
      }

      if (b('===').equals(b(bufferCursor.currentAndNext(3)))) {
        this.type = types.StrictEquality
        bufferCursor.forward(3)
        return
      }


      if (K.english_alphabet.includes(bufferCursor.current())) {
        this.type = types.NameInstance
        let partialPath: string[] = []
        let lastPosChar = 0
        let acum: number[] = []

        while (true) {
          if (bufferCursor.isClosed() || bufferCursor.current() === K.space || bufferCursor.current() === K.newLineLF) {
            partialPath.push(toBuffer(acum).toString())
            this.value = partialPath
            bufferCursor.forward()
            return
          }

          if (
            bufferCursor.current() === K.dot
          ) {
            partialPath.push(toBuffer(acum).toString())
            acum = []
            bufferCursor.forward()
            continue
          }

          if (
            K.english_alphabet.includes(bufferCursor.current()) ||
            K.underscore === bufferCursor.current() ||
            K.numbers.includes(bufferCursor.current())
          ) {
            acum.push(bufferCursor.current())
            bufferCursor.forward()
            continue
          }

          this.rejectUnexpectedTokenError()
        }
      }

      if (
        K.doubleQuotes === bufferCursor.current() ||
        K.singleQuote === bufferCursor.current()
      ) {
        this.type = types.String
        const initialQuote = bufferCursor.current()
        bufferCursor.forward()

        while (true) {
          const p = bufferCursor.prev(2);
          if (bufferCursor.isClosed() || initialQuote === bufferCursor.current() || bufferCursor.current() === K.newLineLF) {
            bufferCursor.forward()
            this.value = String(this.raw)
            return
          }

          if (bufferCursor.current() == K.backslash) {
            bufferCursor.forward()
            switch (bufferCursor.current()) {
              case 0x74: {
                this.appendRaw(K.horizontalTab)
                bufferCursor.forward()
                continue
              }
              case 0x6e: {
                this.appendRaw(K.newLineLF)
                bufferCursor.forward()
                continue
              }
              default: {
                this.appendRaw(bufferCursor.current())
                bufferCursor.forward()
                continue
              }
            }
          }

          this.appendRaw(bufferCursor.current())
          bufferCursor.forward()
        }
      }

      if (K.numbers.includes(bufferCursor.current())) {
        this.type = types.Number
        while (true) {
          if (bufferCursor.isClosed() || K.space === bufferCursor.current() || bufferCursor.current() === K.newLineLF) {
            bufferCursor.forward()
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
    while (true) {
      if (bufferCursor.current() === K.newLineLF || bufferCursor.current() === K.numberSign || bufferCursor.isClosed()) {
        bufferCursor.forward();
        return;
      }

      this.children.push(this.createElement(StatementObject));
      // if (bufferCursor.has())
      //   console.log(bufferCursor.position, JSON.stringify(b([bufferCursor.current()]).toString()), this.children)

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

    if (bufferCursor.current() === K.space) this.createElement(Space)

    this.operator = this.createElement(VariableKey)

    switch (this.operator.raw.toString()) {
      case 'if': break;
      case 'fi': break;
      default: {
        bufferCursor.backward(this.operator.raw.length);
        this.rejectUnexpectedTokenError();
      }
    }

    if (this.operator.raw.equals(b('fi'))) {
      return;
    }

    this.createElement(Space)

    this.statement = this.createElement(CommentOperatorStatement)

    this.block = this.createElement(Block, {
      handleCheckCloseBlock() {
        const lastChild = this.children[this.children.length - 1]
        if (lastChild instanceof CommentOperator && lastChild.operator.raw.equals(b('fi'))) {
          return true;
        }
        return false;
      }
    })
  }
}
