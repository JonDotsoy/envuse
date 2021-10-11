import { Base } from "./statements/components/base";
import { Block, BlockType } from "./statements/components/block";
import { ArrCursor } from "./statements/lib/arr-cursor";
import { CommentOperator } from "./statements/components/comment-operator";
import { UnexpectedTokenError } from "./statements/tdo/unexpected-token-error";
import { Variable } from "./statements/components/variable";
import { StatementObject } from "./statements/components/statement-object";
import fs from "fs";
import { BlockComment } from "./statements/components/block-comment";
import { CommentInline } from "./statements/components/comment-inline";
import { stringify as DataSourceStringify } from "./statements/lib/stringify";
import { StringifyOptions } from "./statements/lib/stringify-options";

// data source

export type CustomType = {
  type: string;
  parser: (ctx: {
    valueStr: string;
    elementVariable: Variable;
    elementDescription: null | BlockComment;
  }) => any;
};

const stringType: CustomType = {
  type: "string",
  parser: (ctx) => {
    const valueStr = ctx.valueStr;
    return valueStr;
  },
};

const numberType: CustomType = {
  type: "number",
  parser: (ctx) => {
    const valueStr = ctx.valueStr;
    const v = Number(valueStr);
    if (isNaN(v) || v === Infinity) {
      ctx.elementVariable.rejectUnexpectedTokenError({
        message: `${valueStr} is not a valid number`,
        position: ctx.elementVariable.valueVariable.pos,
      });
    }
    return v;
  },
};

const booleanType: CustomType = {
  type: "boolean",
  parser: (ctx) => {
    const valueStr = ctx.valueStr;
    if (["true", "false"].indexOf(valueStr) === -1) {
      ctx.elementVariable.rejectUnexpectedTokenError({
        message: `${valueStr} is not a valid boolean`,
        position: ctx.elementVariable.valueVariable.pos,
      });
    }
    return valueStr === "true";
  },
};

export const defaultCustomTypes: CustomType[] = [
  stringType,
  numberType,
  booleanType,
];

export type Definition = {
  type: string;
  description: string | null;
  value: any;
  valueStr: string;
  elementVariable: Variable;
  elementDescription?: BlockComment | null;
};

export type Option =
  | Buffer
  | {
      filename?: string | null;
      body: Buffer;
    };

export type Values = {
  [k: string]: any;
};

export type CompileOptions = {
  customTypes?: CustomType[];
};

/** AST Parser */
export class DataSource {
  private constructor(private filename: string | null, private body: Buffer) {}

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
        // console.log(inspect(statementObject));
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
          accumulator = getValue(a.current());
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

  static parse(options: Option & CompileOptions, values?: Values) {
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

    const isVariable = (element: Base): element is Variable =>
      element instanceof Variable;
    const isDescriptor = (element: Base): element is BlockComment =>
      element instanceof BlockComment;
    const isComment = (element: Base): element is CommentInline =>
      element instanceof CommentInline;

    // const variableList = ast.elementList.filter(
    //   (element): element is Variable => element instanceof Variable
    // );

    let description: BlockComment | null = null;

    const variableList = ast.elementList.reduce((acum, element) => {
      if (isDescriptor(element)) {
        description = element;
      }
      if (isComment(element)) {
        description = null;
      }
      if (isVariable(element)) {
        acum.push([element, description]);
        description = null;
      }
      return acum;
    }, [] as [Variable, BlockComment | null][]);

    const definitions = variableList.reduce((acum, [element, description]) => {
      const operators = operatorsList.filter((operator) =>
        operator.operator.elementList.includes(element)
      );

      if (operators.length) {
        const result = operators.reduce(
          (v, operator) =>
            v &&
            operator.assert({
              ...values,
              ...Object.fromEntries(
                Object.entries(acum).map(([k, v]) => [k, v.value])
              ),
            }),
          true
        );
        if (!result) {
          return acum;
        }
      }

      const type = element.typeVariable?.value ?? "string";
      const valueStr = element.valueVariable.value;

      const customTypes = [
        ...defaultCustomTypes,
        ...(options.customTypes ?? []),
      ];

      const getValue = () => {
        for (const customType of customTypes) {
          if (customType.type === type) {
            return customType.parser({
              elementDescription: description,
              elementVariable: element,
              valueStr,
            });
          }
        }

        throw new Error(`Unsupported type ${type}`);
      };

      return {
        ...acum,
        [element.keyVariable.value]: {
          type,
          valueStr,
          description: description?.value ?? null,
          value: getValue(),
          elementVariable: element,
          elementDescription: description,
        },
      };
    }, {} as { [k: string]: Definition });

    const parsed = Object.entries(definitions).reduce(
      (acum, [name, def]) => ({ ...acum, [name]: def.valueStr }),
      {} as { [k: string]: string }
    );

    return { definitions, parsed, ast } as const;
  }

  static parseFile(
    filename: string,
    values?: { [k: string]: any },
    options?: CompileOptions
  ) {
    // read file and store buffer
    const buffer = fs.readFileSync(filename);

    return this.parse({ filename, body: buffer, ...options }, values);
  }

  static createDataSource(options: Option) {
    if (options instanceof Buffer) {
      return new DataSource(null, options).toAstBody();
    }
    return new DataSource(options.filename ?? null, options.body).toAstBody();
  }

  static stringify(comp: BlockType, options?: StringifyOptions) {
    return DataSourceStringify(comp, options);
  }
}
