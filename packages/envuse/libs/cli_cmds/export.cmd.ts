import { Command } from "../command";
import { Builder, option, optional, Opts } from "../builder";

export class ExportCmd extends Command {
  match: RegExp = /^export$/;
  builder: Builder = Opts(
    option("out", String),
    optional(option("format", String))
  );
}
