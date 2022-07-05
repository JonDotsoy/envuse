import { Builder, parseOptions } from "./builder";

export class CommandMatch {
  constructor(
    readonly kind: Command,
    readonly args: string[],
    readonly options: any
  ) {}
}

export abstract class Command {
  declare match: RegExp;
  builder?: Builder;

  test(line: string): boolean {
    return this.match.test(line);
  }

  parse(...args: string[]) {
    const [cmdLine, ...rest] = args;
    const options = parseOptions(this.builder, rest);

    if (this.match.test(cmdLine)) {
      return new CommandMatch(this, rest, options);
    }
  }
}
