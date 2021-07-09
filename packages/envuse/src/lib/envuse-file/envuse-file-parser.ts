import { eventNames } from "process";
import { Base } from "./statements/Base";
import { Block } from "./statements/Block";
import { ArrCursor } from "./statements/ArrCursor";
import { CommentOperator } from "./statements/CommentOperator";
import { UnexpectedTokenError } from "./statements/UnexpectedTokenError";
import { Variable } from "./statements/Variable";
import { StatementObject } from "./statements/StatementObject";

type Option = {
  filename?: string | null;
  body: Buffer;
};

/** AST Parser */
export class EnvuseFileParser {
  constructor(private filename: string | null, private body: Buffer) { }

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

  private static makeOperatorEvaluator(operator: CommentOperator) {
    return (value: { [k: string]: any }) => {
      const a = new ArrCursor(operator.statement.statements)
      let accumulator: any;

      while (a.has()) {
        if (a.position === 0) {
          accumulator = a.current().value
          a.forward()
          continue
        }

        switch (a.current().type) {
          case 'StrictEqualitySymbol': {
            a.forward()
            accumulator = accumulator === a.current().value
            a.forward()
            break
          }
          default: throw new Error(`Statement no expected`)
        }
      }

      return accumulator
    }
  }

  static parse(options: Option) {
    const ast = this.parseToAst(options)

    const operatorsList = ast.elementList
      .filter((element): element is CommentOperator => element instanceof CommentOperator)
      .map((operator) => ({
        operator,
        assert: this.makeOperatorEvaluator(operator),
      }))

    const variableList = ast.elementList.filter((element): element is Variable => element instanceof Variable)

    const parsed = variableList
      .reduce((acum, element) => {
        const operators = operatorsList.filter(operator => operator.operator.elementList.includes(element))
        if (operators.length) {
          const result = operators.reduce((v, operator) => v && operator.assert(acum), true)
          if (!result) {
            return acum;
          }
        }
        return {
          ...acum,
          [element.keyVariable.value]: element.valueVariable.value
        };
      }, {} as { [k: string]: any; });

    return { parsed } as const
  }

  static parseToAst(options: Option) {
    return new EnvuseFileParser(options.filename ?? null, options.body).toAstBody();
  }
}
