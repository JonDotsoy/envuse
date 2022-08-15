import {
  EvaluationError,
  EvaluationErrorOption,
  FieldCannotConvert,
  TypeUnsupported,
} from "./errors/evaluation-error";
import {
  EnvuseDeclaration,
  VariableDeclaration,
} from "./types/envuse-declaration";
import { VariableSchema } from "./types/node";

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
      try {
        const transformRawValue = transformersRawValue[declaration.type];
        if (!transformRawValue) {
          const variableNode = VariableSchema.parse(declaration._node?.[1]);
          const evaluation_error_option: EvaluationErrorOption = {
            functionName: "evaluate",
            node: variableNode?.Variable.variable_type?.[1].VariableType
              .variable_type,
            location: options?.location,
          };
          throw new TypeUnsupported({
            type: declaration.type,
            evaluation_error_option,
          });
        }
        return [key, transformRawValue(key, originConfigs[key])];
      } catch (ex) {
        if (ex instanceof FieldCannotConvert) {
          const variableNode = VariableSchema.parse(declaration._node?.[1]);
          const evaluation_error_option: EvaluationErrorOption = {
            functionName: "evaluate",
            node: variableNode?.Variable.variable_type?.[1].VariableType
              .variable_type,
            location: options?.location,
          };
          throw new FieldCannotConvert({
            ...ex.opt,
            evaluation_error_option,
          });
        }
        throw ex;
      }
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
