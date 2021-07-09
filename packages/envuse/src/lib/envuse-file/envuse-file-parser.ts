import { Base } from "./statements/Base";
import { Block } from "./statements/Block";
import { UnexpectedTokenError } from "./statements/UnexpectedTokenError";

type Option = {
  filename: string | null;
  body: Buffer;
};

/** AST Parser */
export class EnvuseFileParser {
  constructor(private filename: string | null, private body: Buffer) {}

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

  static parseToAst(options: Option) {
    return new EnvuseFileParser(options.filename, options.body).toAstBody();
  }
}
