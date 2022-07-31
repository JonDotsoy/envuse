import { Command } from "../command";

export class RunCmd extends Command {
  match: RegExp = /^run$/;
}
