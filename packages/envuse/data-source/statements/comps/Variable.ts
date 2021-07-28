import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { Space } from "./Space";
import { VariableKey, VariableKeyType } from "./VariableKey";
import { charactersKeys } from "../tdo/charactersKeys";
import { SymbolEqual } from "./SymbolEqual";
import { VariableValue, VariableValueType } from "./VariableValue";
import { CharactersKey } from "../tdo/CharactersKey";
import { SymbolColon } from "./SymbolColon";
import { stringifyCtx } from "../lib/stringifyCtx";
import { CommentInline } from "./CommentInline";
import { SymbolExclamationMark } from "./SymbolExclamationMark";

export type VariableType = {
  $type: "Variable";
  required?: boolean;
  keyVariable: VariableKeyType;
  typeVariable?: VariableKeyType;
  valueVariable: VariableValueType;
  [k: string]: any;
};

export class Variable extends Base {
  $type = "Variable" as const;

  required?: boolean;
  keyVariable!: VariableKey;
  typeVariable?: VariableKey;
  valueVariable!: VariableValue;

  prepare(bufferCursor: BufferCursor): void {
    const keyVariable = this.createElement(VariableKey);
    this.keyVariable = keyVariable;

    if (bufferCursor.currentIs(CharactersKey.space)) {
      this.createElement(Space);
    }

    // Next cursor is an exclamation mark
    if (bufferCursor.currentIs(CharactersKey.exclamationMark)) {
      this.createElement(SymbolExclamationMark);
      this.required = true;
    }

    if (bufferCursor.current() === CharactersKey.space) {
      this.createElement(Space);
    }

    if (bufferCursor.current() === CharactersKey.colon) {
      this.createElement(SymbolColon);

      if (bufferCursor.current() === CharactersKey.space) {
        this.createElement(Space);
      }

      const keyVariable = this.createElement(VariableKey);
      this.typeVariable = keyVariable;

      if (bufferCursor.current() === CharactersKey.space) {
        this.createElement(Space);
      }
    }

    if (bufferCursor.current() === CharactersKey.equalsSign) {

      this.createElement(SymbolEqual);

      if (bufferCursor.current() === CharactersKey.space) {
        this.createElement(Space);
      }

      const valueVariable = this.createElement(VariableValue);
      this.valueVariable = valueVariable;

      if (bufferCursor.current() === CharactersKey.space) {
        this.createElement(Space);
      }
    }

    if (bufferCursor.current() === CharactersKey.numberSign) {
      this.createElement(CommentInline);
      return
    }

    if (bufferCursor.currentIs(CharactersKey.newLineLF) || bufferCursor.isClosed()) {
      bufferCursor.forward();

      return
    }

    this.rejectUnexpectedTokenError();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      children: undefined,
      keyVariable: this.keyVariable,
      typeVariable: this.typeVariable,
      valueVariable: this.valueVariable,
    };
  }

  static charactersKey = charactersKeys;

  static serialize(comp: VariableType) {
    const variableWithoutValue = stringifyCtx.options?.variableWithoutValue ?? false;

    let partialVariableOut = Buffer.from(`${VariableKey.serialize(comp.keyVariable)}`);

    if (comp.required) {
      partialVariableOut = Buffer.concat([
        partialVariableOut,
        Buffer.from(`!`),
      ]);
    }

    if (comp.typeVariable) {
      partialVariableOut = Buffer.concat([
        partialVariableOut,
        Buffer.from(` : `),
        Buffer.from(`${VariableKey.serialize(comp.typeVariable)}`),
      ]);
    } else {
      partialVariableOut = Buffer.concat([
        partialVariableOut,
        Buffer.from(` : `),
        Buffer.from(`${VariableKey.serialize({
          $type: "VariableKey",
          value: "string",
        })}`),
      ]);
    }

    if (variableWithoutValue) {
      return Buffer.concat([
        partialVariableOut,
        Buffer.from(`\n`),
      ]);
    }

    partialVariableOut = Buffer.concat([
      partialVariableOut,
      Buffer.from(" = "),
      VariableValue.serialize(comp.valueVariable),
      Buffer.from("\n"),
    ]);

    return partialVariableOut;
  }
}
