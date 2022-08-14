import {
  CannotConvert,
  EvaluationError,
  FieldCannotConvert,
  TypeUnsupported,
} from "./errors/evaluation-error";
import {
  EnvuseDeclaration,
  VariableDeclaration,
} from "./types/envuse-declaration";
import { NodeSchema, VariableSchema } from "./types/node";

export type listConfigTypes = import("../list-config-types").listConfigTypes;
type ConfigDescribe<T, K extends string> = T extends { [k in K]: object }
  ? T[K]
  : Record<string, any>;

type Transform = (key: string, rawValue: string | undefined | null) => any;

const stringTransform: Transform = (key, raw) => {
  if (!raw) throw new FieldCannotConvert({ key, raw, type: "string" });
  return raw;
};

const numberTransform: Transform = (key, raw) => {
  if (!raw) throw new FieldCannotConvert({ key, raw, type: "number" });
  if (!/^\d+$/.test(raw))
    throw new FieldCannotConvert({ key, raw, type: "number" });
  return Number(raw);
};

const transformersRawValue: Record<string, Transform | undefined> = {
  string: stringTransform,
  number: numberTransform,
};

type EvaluateOption = {
  location?: URL;
};

export const evaluate = <K extends string = "", O = listConfigTypes>(
  declaration: EnvuseDeclaration,
  originConfigs: Record<string, string | undefined | null>,
  options?: EvaluateOption
): { config: ConfigDescribe<O, K> } => {
  try {
    const parseValue = ([key, declaration]: [string, VariableDeclaration]): [
      string,
      any
    ] => {
      const transformRawValue = transformersRawValue[declaration.type];
      if (!transformRawValue) {
        const a = VariableSchema.parse(declaration._node?.[1]);
        // const a = newLocal.success ? newLocal.data : null;
        throw new TypeUnsupported({
          type: declaration.type,
          evaluation_error_option: {
            functionName: "evaluate",
            node: a?.Variable.variable_type?.[1].VariableType.variable_type,
            // node: newLocal.success ? (newLocal.data.Variable.variable_type ?? declaration._node) : null,
            location: options?.location,
          },
        });
      }
      return [key, transformRawValue(key, originConfigs[key])];
    };

    const config: any = Object.fromEntries(
      Object.entries(declaration.variables).map(parseValue)
    );

    return { config };
  } catch (ex) {
    if (ex instanceof EvaluationError) {
      Error.captureStackTrace(ex, evaluate);
    }
    throw ex;
  }
};
