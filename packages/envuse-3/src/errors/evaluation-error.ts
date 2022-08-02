import { evaluate } from "../evaluation";
import { Node } from "../types/node";

class A implements NodeJS.CallSite {
  constructor(
    readonly self: unknown,
    readonly evaluation_error_option?: EvaluationErrorOption
  ) {}
  getThis(): unknown {
    return this.self;
  }
  getTypeName(): string | null {
    return null;
  }
  getFunction(): Function | undefined {
    return undefined;
  }
  getFunctionName(): string | null {
    return this.evaluation_error_option?.functionName ?? null;
  }
  getMethodName(): string | null {
    return null;
  }
  getFileName(): string | null {
    return this.evaluation_error_option?.location?.href ?? null;
  }
  getLineNumber(): number | null {
    return this.evaluation_error_option?.node?.[0].span.end.line ?? null;
  }
  getColumnNumber(): number | null {
    return this.evaluation_error_option?.node?.[0].span.end.column ?? null;
  }
  getEvalOrigin(): string | undefined {
    return undefined;
  }
  isToplevel(): boolean {
    return false;
  }
  isEval(): boolean {
    return false;
  }
  isNative(): boolean {
    return !this.evaluation_error_option?.location?.href;
  }
  isConstructor(): boolean {
    return false;
  }
}

type EvaluationErrorOption = {
  functionName?: string;
  location?: URL;
  node?: Node<any> | null;
};

const o = Error.prepareStackTrace;
Error.prepareStackTrace = (err, traces) => {
  if (err instanceof EvaluationError) {
    return o?.(err, [new A(err, err.evaluation_error_option), ...traces]);
  }
  return o?.(err, [...traces]);
};

export class EvaluationError extends Error {
  constructor(
    message: string,
    readonly evaluation_error_option?: EvaluationErrorOption
  ) {
    super(message);
    // if (evaluation_error_option?.node) {

    // Error.prepareStackTrace?.(this, [new A(this, evaluation_error_option)]);
    // }
  }
}

export class TypeUnsupported extends EvaluationError {
  constructor(
    readonly opt: {
      type: string;
      evaluation_error_option?: EvaluationErrorOption;
    }
  ) {
    super(
      `Can't be parse the type \`${opt.type}\``,
      opt.evaluation_error_option
    );
  }
}

// export class CannotConvert extends EvaluationError {
//   constructor(opt: { raw: string | null | undefined, type: string }) {
//     super(`Cannot convert ${opt.raw} to a \`${opt.type}\``)
//   }
// }

export class CannotConvert extends EvaluationError {
  constructor(
    readonly opt: {
      raw: string | null | undefined;
      type: string;
      evaluation_error_option?: EvaluationErrorOption;
    }
  ) {
    super(
      `Cannot convert ${opt.raw} to a \`${opt.type}\``,
      opt.evaluation_error_option
    );
  }
}

export class FieldCannotConvert extends EvaluationError {
  constructor(
    readonly opt: {
      key: string;
      raw: string | null | undefined;
      type: string;
      evaluation_error_option?: EvaluationErrorOption;
    }
  ) {
    super(
      `Config ${opt.key}: Cannot convert ${opt.raw} to a \`${opt.type}\``,
      opt.evaluation_error_option
    );
  }
}
