import { Root } from "./Root";

/** AST Parser */
export class EnvuseFileParser {
  constructor(
    private body: Buffer
  ) { }

  toAstBody() {
    return new Root(this.body, 0).load();
  }
}