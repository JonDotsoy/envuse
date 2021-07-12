import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { BCharType } from "../tdo/BCharType";
import { StatementObjectTypes } from "../tdo/StatementObjectTypes";
import { typesValues } from "./typesValues";

import { StatementTrueObject } from "./statement-object/StatementTrueObject";
import { StatementFalseObject } from "./statement-object/StatementFalseObject";
import { StatementStrictEqualObject } from "./statement-object/StatementStrictEqualObject";
import { StatementNameInstanceObject } from "./statement-object/StatementNameInstanceObject";
import { StatementStringObject } from "./statement-object/StatementStringObject";
import { StatementNumberObject } from "./statement-object/StatementNumberObject";


export class StatementObject extends Base {
  $type = 'StatementObject' as const;
  
  static types = StatementObjectTypes;

  type!: typesValues;
  value: any;

  readonly definitions = [
    new StatementTrueObject(() => this.rejectUnexpectedTokenError()),
    new StatementFalseObject(() => this.rejectUnexpectedTokenError()),
    new StatementStrictEqualObject(() => this.rejectUnexpectedTokenError()),
    new StatementNameInstanceObject(() => this.rejectUnexpectedTokenError()),
    new StatementStringObject(() => this.rejectUnexpectedTokenError()),
    new StatementNumberObject(() => this.rejectUnexpectedTokenError()),
  ] as const;

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

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      value: this.value,
    }
  }
}
