import { Base } from "./Base";
import { BufferCursor } from "../lib/BufferCursor";
import { Space } from "./Space";
import { SpaceNewLine } from "./SpaceNewLine";
import { VariableKey } from "./VariableKey";
import { charactersKeys } from "../tdo/charactersKeys";
import { SymbolEqual } from "./SymbolEqual";
import { VariableValue } from "./VariableValue";

export class Variable extends Base {
  $type = 'Variable' as const;

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

  static charactersKey = charactersKeys;
}
