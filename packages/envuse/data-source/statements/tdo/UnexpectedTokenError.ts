import path from "path";

const getLineStyled = (
  filename: string | null,
  body: Buffer,
  position: number
) => {
  let lineNumber = 1;
  let column = 1;
  let posStartLine = 0;
  let posEndLine = body.length;
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];
    if (index < position) {
      column += 1;
      if (char === 0x0a) {
        posStartLine = index;
        lineNumber += 1;
        column = 1;
      }
    } else {
      if (char === 0x0a) {
        posEndLine = index;
        break;
      }
    }
  }

  const prefixLine = body.slice(posStartLine + 1, position).toString();
  const charLocated = Buffer.from([body[position]]).toString();
  const sufixLine = body.slice(position + 1, posEndLine).toString();
  const enumerator = `${lineNumber} | `;
  const lineStyled = [
    `${enumerator}${prefixLine}${charLocated}${sufixLine}`,
    `${" ".repeat(enumerator.length + prefixLine.length)}^`,
  ].join("\n");

  return {
    stackDescriptor: `${filename ? path.relative(process.cwd(), filename) : "<anonymous>"
      }:${lineNumber}:${column}`,
    lineNumber,
    columnNumber: column,
    position,
    lineStyled,
  };
};


export type UnexpectedTokenErrorOption = {
  message?: string
}


export class UnexpectedTokenError extends Error {
  name = "UnexpectedTokenError";
  columnNumber: number;
  lineNumber: number;
  lineStyled: string;

  constructor(
    readonly filename: string | null,
    body: Buffer,
    readonly position: number,
    options: UnexpectedTokenErrorOption,
  ) {
    super();

    const newLocal = getLineStyled(filename, body, position);
    this.message = `${options.message ?? "Unexpected token"} position (${newLocal.stackDescriptor}) (position: ${position}):\n${newLocal.lineStyled}`;

    this.columnNumber = newLocal.columnNumber;
    this.lineNumber = newLocal.lineNumber;
    this.lineStyled = newLocal.lineStyled;
  }

  static isUnexpectedTokenError(err: any): err is UnexpectedTokenError {
    return err instanceof UnexpectedTokenError;
  }
}
