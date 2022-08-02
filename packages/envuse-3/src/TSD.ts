export abstract class TSD {
  abstract toTSDString(depth: number): string;
  toString() {
    return this.toTSDString(0);
  }
  static helpGeneratorLines(depth: number, cb: () => Iterable<string>) {
    return Array.from(cb())
      .map((l) => `${"  ".repeat(depth)}${l}\n`)
      .join("");
  }
}

export class SymbolTSD extends TSD {
  constructor(readonly symbol: string) {
    super();
  }

  toTSDString(depth: number): string {
    return this.symbol;
  }
}

export class FieldTSD extends TSD {
  constructor(readonly name: string, readonly value: TSD) {
    super();
  }

  toTSDString(depth: number): string {
    return `${JSON.stringify(this.name)}: ${this.value.toTSDString(depth)}`;
  }
}

export class StructTSD extends TSD {
  constructor(readonly fields: FieldTSD[]) {
    super();
  }

  toTSDString(depth: number): string {
    const self = this;
    return `\n${TSD.helpGeneratorLines(depth, function* () {
      yield `  {`;
      for (const field of self.fields) {
        yield `    ${field.toTSDString(depth + 2)}`;
      }
      yield `  }`;
    })}`;
  }
}
