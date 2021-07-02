const getLineStyled = (body: Buffer, position: number) => {

  let lineNumber = 1;
  let posStartLine = 0
  let posEndLine = body.length
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];
    if (index < position) {
      if (char === 0x0a) {
        posStartLine = index
        lineNumber += 1
      }
    } else {
      if (char === 0x0a) {
        posEndLine = index
        break
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
  ].join('\n');

  return lineStyled
}

export class UnexpectedTokenError extends Error {
  name = 'UnexpectedTokenError'

  constructor(body: Buffer, readonly position: number) {
    super(`Unexpected token position ${position}:\n${getLineStyled(body, position)}`);
  }

  static isUnexpectedTokenError(err: any): err is UnexpectedTokenError {
    return err instanceof UnexpectedTokenError;
  }
}
