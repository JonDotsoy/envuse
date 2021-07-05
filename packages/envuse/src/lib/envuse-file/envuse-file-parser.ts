import { Base } from "./statements/Base";
import { Block } from "./statements/Root";
import { UnexpectedTokenError } from "./statements/UnexpectedTokenError";

/** AST Parser */
export class EnvuseFileParser {
  constructor(
    private filename: string,
    private body: Buffer
  ) { }

  toAstBody() {
    try {
      return Base.createElement(new Block(this.filename, this.body, 0));
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