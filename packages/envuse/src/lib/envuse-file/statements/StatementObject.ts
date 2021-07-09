import { Base } from "./Base";
import { BufferCursor } from "./BufferCursor";
import { BCharType } from "./BCharType";
import { CharactersKey as k } from "./CharactersKey";
import { toBuffer as b, toBuffer } from "./toBuffer";
import { StatementObjectTypes } from "./StatementObjectTypes";
import util from "util";

abstract class StatementObjectDefinition {
  type!: string;
  value: any;

  constructor(readonly rejectUnexpectedTokenError: () => never) {}

  abstract assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number>;
  abstract prepare(bufferCursor: BufferCursor<BCharType>): void;
}

class StatementTrueObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() && b("true").equals(b(bufferCursor.currentAndNext(4)))
    );
  }

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    this.type = StatementObjectTypes.Boolean;
    this.value = true;
    bufferCursor.forward(4);
    return;
  }
}

class StatementFalseObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() && b("true").equals(b(bufferCursor.currentAndNext(4)))
    );
  }

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    this.type = StatementObjectTypes.Boolean;
    this.value = false;
    bufferCursor.forward(5);
    return;
  }
}

class StatementStrictEqualObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() && b("===").equals(b(bufferCursor.currentAndNext(3)))
    );
  }

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    this.type = StatementObjectTypes.StrictEquality;
    bufferCursor.forward(3);
    return;
  }
}

class StatementNameInstanceObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() && k.english_alphabet.includes(bufferCursor.current())
    );
  }

  prepare(bufferCursor: BufferCursor<number>): void {
    this.type = StatementObjectTypes.NameInstance;
    let partialPath: string[] = [];
    let charAccumulation: number[] = [];

    while (true) {
      if (
        bufferCursor.isClosed() ||
        bufferCursor.current() === k.space ||
        bufferCursor.current() === k.newLineLF
      ) {
        partialPath.push(toBuffer(charAccumulation).toString());
        this.value = partialPath;
        // bufferCursor.forward();
        return;
      }

      if (bufferCursor.current() === k.dot) {
        partialPath.push(toBuffer(charAccumulation).toString());
        charAccumulation = [];
        bufferCursor.forward();
        continue;
      }

      if (
        k.english_alphabet.includes(bufferCursor.current()) ||
        k.underscore === bufferCursor.current() ||
        k.numbers.includes(bufferCursor.current())
      ) {
        charAccumulation.push(bufferCursor.current());
        bufferCursor.forward();
        continue;
      }

      this.rejectUnexpectedTokenError();
    }
  }
}

class StatementStringObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return (
      bufferCursor.has() &&
      (k.doubleQuotes === bufferCursor.current() ||
        k.singleQuote === bufferCursor.current())
    );
  }

  prepare(bufferCursor: BufferCursor<number>): void {
    const raw: number[] = [];
    const appendRaw = (...chars: number[]) => {
      raw.push(...chars);
    };

    this.type = StatementObjectTypes.String;
    const initialQuote = bufferCursor.current();
    bufferCursor.forward();

    while (true) {
      const p = bufferCursor.prev(2);
      if (
        bufferCursor.isClosed() ||
        initialQuote === bufferCursor.current() ||
        bufferCursor.current() === k.newLineLF
      ) {
        bufferCursor.forward();
        this.value = String(b(raw));
        return;
      }

      if (bufferCursor.current() == k.backslash) {
        bufferCursor.forward();
        switch (bufferCursor.current()) {
          case 0x74: {
            appendRaw(k.horizontalTab);
            bufferCursor.forward();
            continue;
          }
          case 0x6e: {
            appendRaw(k.newLineLF);
            bufferCursor.forward();
            continue;
          }
          default: {
            appendRaw(bufferCursor.current());
            bufferCursor.forward();
            continue;
          }
        }
      }

      appendRaw(bufferCursor.current());
      bufferCursor.forward();
    }
  }
}

class StatementNumberObject extends StatementObjectDefinition {
  assert(
    bufferCursor: BufferCursor<BCharType>
  ): bufferCursor is BufferCursor<number> {
    return bufferCursor.has() && k.numbers.includes(bufferCursor.current());
  }

  prepare(bufferCursor: BufferCursor<number>): void {
    const raw: number[] = [];
    const appendRaw = (...chars: number[]) => {
      raw.push(...chars);
    };

    this.type = StatementObjectTypes.Number;
    while (true) {
      if (
        bufferCursor.isClosed() ||
        k.space === bufferCursor.current() ||
        bufferCursor.current() === k.newLineLF ||
        bufferCursor.current() === k.equalsSign
      ) {
        this.value = Number(b(raw));
        return;
      }
      if (
        k.numbers.includes(bufferCursor.current()) ||
        bufferCursor.current() === k.dot
      ) {
        appendRaw(bufferCursor.current());
        bufferCursor.forward();
        continue;
      }
      if (bufferCursor.current() === k.underscore) {
        bufferCursor.forward();
        continue;
      }
      this.rejectUnexpectedTokenError();
    }
  }
}

export class StatementObject extends Base {
  static types = StatementObjectTypes;

  type!: string;
  value: any;

  definitions: StatementObjectDefinition[] = [
    new StatementTrueObject(() => this.rejectUnexpectedTokenError()),
    new StatementFalseObject(() => this.rejectUnexpectedTokenError()),
    new StatementStrictEqualObject(() => this.rejectUnexpectedTokenError()),
    new StatementNameInstanceObject(() => this.rejectUnexpectedTokenError()),
    new StatementStringObject(() => this.rejectUnexpectedTokenError()),
    new StatementNumberObject(() => this.rejectUnexpectedTokenError()),
  ];

  toObjectName() {
    return `${this.constructor.name}<${this.type ?? "unknown"}>`;
  }

  prepare(bufferCursor: BufferCursor<BCharType>): void {
    if (bufferCursor.has()) {
      for (const definition of this.definitions) {
        if (definition.assert(bufferCursor)) {
          definition.prepare(bufferCursor);
          this.type = definition.type;
          this.value = definition.value;
          return;
        }
      }
    }

    this.rejectUnexpectedTokenError();
  }
}
