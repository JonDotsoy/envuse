import { Base } from "./Base";
import { Root } from "./Root";
import { UnexpectedTokenError } from "./UnexpectedTokenError";

/** AST Parser */
export class EnvuseFileParser {
  constructor(
    private filename: string,
    private body: Buffer
  ) { }

  toAstBody() {
    try {
      return Base.createElement(new Root(this.filename, this.body, 0));
    } catch (err) {
      if (UnexpectedTokenError.isUnexpectedTokenError(err)) {
        // Error.captureStackTrace(err, EnvuseFileParser.prototype.toAstBody);
        // const stack = err.stack;
        // if (stack) {
        //   // let posEndMessage = err.name.length + err.message.length + 3;
        // }
      }
      throw err;
    }
  }
}