import { Command } from "./command";

export class Cli {
  commands: Command[] = [];

  use(command: Command) {
    this.commands.push(command);
  }

  parse(...args: string[]) {
    for (const command of this.commands) {
      const r = command.parse(...args);
      if (r) {
        return r;
      }
    }
  }
}
