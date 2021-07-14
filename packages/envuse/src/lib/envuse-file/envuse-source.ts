import { eventNames } from "process";
import { Base } from "./statements/comps/Base";
import { Block, BlockType } from "./statements/comps/Block";
import { ArrCursor } from "./statements/lib/ArrCursor";
import { CommentOperator } from "./statements/comps/CommentOperator";
import { UnexpectedTokenError } from "./statements/tdo/UnexpectedTokenError";
import { Variable } from "./statements/comps/Variable";
import { StatementObject } from "./statements/comps/StatementObject";
import fs from "fs";

type Option =
  | Buffer
  | {
      filename?: string | null;
      body: Buffer;
    };

/** AST Parser */
export class Envuse {
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

  private static makeOperatorEvaluator(operator: CommentOperator) {
    return (value: { [k: string]: any }) => {
      const a = new ArrCursor(operator.statement.statements);
      let accumulator: any;

      const getValue = (statementObject: StatementObject) => {
        switch (statementObject.type) {
          case "NameInstance":
            return (
              Array.isArray(statementObject.value) &&
              statementObject.value.reduce(
                (r, path) => (typeof r === "object" ? r[path] : undefined),
                value
              )
            );
          case "Number":
          case "Boolean":
          case "String":
            return statementObject.value;
          default:
            throw new Error("unprocessable statement");
        }
      };

      while (a.has()) {
        if (a.position === 0) {
          accumulator = a.current().value;
          a.forward();
          continue;
        }

        switch (a.current().type) {
          case "StrictEqualitySymbol": {
            a.forward();
            // console.log({ accumulator, currentType: a.current().type, currentValue: a.current().value, parsed: getValue(a.current()), value })
            accumulator = accumulator === getValue(a.current());
            a.forward();
            break;
          }
          default:
            throw new Error(`Statement no expected`);
        }
      }

      return accumulator;
    };
  }

  static parse(options: Option, values?: { [k: string]: any }) {
    const ast = this.createDataSource(options);

    const operatorsList = ast.elementList
      .filter(
        (element): element is CommentOperator =>
          element instanceof CommentOperator
      )
      .map((operator) => ({
        operator,
        assert: this.makeOperatorEvaluator(operator),
      }));

    const variableList = ast.elementList.filter(
      (element): element is Variable => element instanceof Variable
    );

    const parsed = variableList.reduce((acum, element) => {
      const operators = operatorsList.filter((operator) =>
        operator.operator.elementList.includes(element)
      );
      if (operators.length) {
        const result = operators.reduce(
          (v, operator) => v && operator.assert({ ...values, ...acum }),
          true
        );
        if (!result) {
          return acum;
        }
      }
      return {
        ...acum,
        [element.keyVariable.value]: element.valueVariable.value,
      };
    }, {} as { [k: string]: any });

    return { parsed, ast } as const;
  }

  static parseFile(filename: string, values?: { [k: string]: any }) {
    // read file and store buffer
    const buffer = fs.readFileSync(filename);

    return this.parse({ filename, body: buffer }, values);
  }

  static createDataSource(options: Option) {
    if (options instanceof Buffer) {
      return new Envuse(null, options).toAstBody();
    }
    return new Envuse(options.filename ?? null, options.body).toAstBody();
  }
}
