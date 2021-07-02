import { Base } from "./Base";
import { Root } from "./Root";

/** AST Parser */
export class EnvuseFileParser {
  constructor(
    private body: Buffer
  ) { }

  toAstBody() {
    return Base.createElement(new Root(this.body, 0));
  }
}