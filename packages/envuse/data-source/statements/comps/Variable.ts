import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { Space } from "./Space";
import { SpaceNewLine } from "./SpaceNewLine";
import { VariableKey, VariableKeyType } from "./VariableKey";
import { charactersKeys } from "../tdo/charactersKeys";
import { SymbolEqual } from "./SymbolEqual";
import { VariableValue, VariableValueType } from "./VariableValue";
import { BaseSerializeOption } from "../tdo/BaseSerializeOption";

export type VariableType = {
  $type: "Variable";
  keyVariable: VariableKeyType;
  valueVariable: VariableValueType;
  [k: string]: any;
};

export class Variable extends Base {
  $type = "Variable" as const;

  keyVariable!: VariableKey;
  valueVariable!: VariableValue;

  prepare(bufferCursor: BufferCursor): void {
    const keyVariable = this.createElement(VariableKey);
    this.keyVariable = keyVariable;
    this.children.push(keyVariable);

    if (bufferCursor.current() === 0x20) {
      this.children.push(this.createElement(Space));
    }

    this.children.push(this.createElement(SymbolEqual));

    if (bufferCursor.current() === 0x20) {
      this.children.push(this.createElement(Space));
    }

    const valueVariable = this.createElement(VariableValue);
    this.valueVariable = valueVariable;
    this.children.push(valueVariable);

    return;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      children: undefined,
      keyVariable: this.keyVariable,
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
