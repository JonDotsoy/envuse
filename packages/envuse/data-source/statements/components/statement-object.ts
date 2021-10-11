import { Base, BaseExportTypeJSON } from "./base";
import { BufferCursor } from "../lib/buffer-cursor";
import { BCharType } from "../tdo/b-char-type";
import { StatementObjectTypes } from "../tdo/statement-object-types";
import { typesValues } from "./types-values";

import { StatementTrueObject } from "./statement-object/statement-true-object";
import { StatementFalseObject } from "./statement-object/statement-false-object";
import { StatementStrictEqualObject } from "./statement-object/statement-strict-equal-object";
import { StatementNameInstanceObject } from "./statement-object/statement-nameInstance-object";
import { StatementStringObject } from "./statement-object/statement-string-object";
import { StatementNumberObject } from "./statement-object/statement-number-object";

type StatementObjectTypeBase =
  | {
      $type: "StatementObject";
      type: "NameInstance";
      value: string[];
    }
  | {
      $type: "StatementObject";
      type: "String";
      value: string;
    }
  | {
      $type: "StatementObject";
      type: "Boolean";
      value: boolean;
    }
  | {
      $type: "StatementObject";
      type: "Number";
      value: number;
    }
  | {
      $type: "StatementObject";
      type: "StrictEqualitySymbol";
      value: "===";
    };

export type StatementObjectType = StatementObjectTypeBase & {
  [k: string]: any;
};

export class StatementObject extends Base {
  $type = "StatementObject" as const;

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
    return <BaseExportTypeJSON<"StatementObject"> & StatementObjectType>{
      ...super.toJSON(),
      type: this.type,
      value: this.value,
    };
  }

  static serialize(comp: StatementObjectType) {
    switch (comp.type) {
      case "NameInstance":
        return Buffer.from(comp.value.join("."));
      case "StrictEqualitySymbol":
        return Buffer.from("===");
      case "String":
        return Buffer.from(JSON.stringify(comp.value.toString()));
      case "Number":
      case "Boolean":
        return Buffer.from(comp.value.toString());
      default: {
        // @ts-ignore
        throw new Error(`type ${comp.type} is not supported`);
      }
    }
  }
}
