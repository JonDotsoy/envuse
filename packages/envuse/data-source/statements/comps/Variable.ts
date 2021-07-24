import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { Space } from "./Space";
import { SpaceNewLine } from "./SpaceNewLine";
import { VariableKey, VariableKeyType } from "./VariableKey";
import { charactersKeys } from "../tdo/charactersKeys";
import { SymbolEqual } from "./SymbolEqual";
import { VariableValue, VariableValueType } from "./VariableValue";
import { BaseSerializeOption } from "../tdo/BaseSerializeOption";
import { CharactersKey } from "../tdo/CharactersKey";
import { SymbolColon } from "./SymbolColon";

export type VariableType = {
  $type: "Variable";
  keyVariable: VariableKeyType;
  typeVariable?: VariableKeyType;
  valueVariable: VariableValueType;
  [k: string]: any;
};

export class Variable extends Base {
  $type = "Variable" as const;

  keyVariable!: VariableKey;
  typeVariable!: VariableKey;
  valueVariable!: VariableValue;

  prepare(bufferCursor: BufferCursor): void {
    const keyVariable = this.createElement(VariableKey);
    this.keyVariable = keyVariable;

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

    this.createElement(SymbolEqual);

    if (bufferCursor.current() === CharactersKey.space) {
      this.createElement(Space);
    }

    const valueVariable = this.createElement(VariableValue);
    this.valueVariable = valueVariable;

    return;
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
    return Buffer.from(
      `${VariableKey.serialize(comp.keyVariable)}=${VariableValue.serialize(
        comp.valueVariable
      )}\n`
    );
  }
}
