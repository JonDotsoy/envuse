// types validations
export type Obj = {
  [k: string | symbol]: unknown;
};

export const haveProp = <K extends string | symbol>(
  obj: Obj,
  propName: K
): obj is typeof obj & { [k in K]: unknown } => propName in obj;

export const withProp = <K extends string | symbol, V = unknown>(
  obj: Obj,
  propName: K,
  val?: (v: unknown) => v is V
): obj is typeof obj & { [k in K]: V } =>
  haveProp(obj, propName) && (val ? val(obj[propName]) : true);

export const isObject = (obj: any): obj is Obj =>
  obj && typeof obj === "object";

export const isObjectTimestamp = (
  obj: any
): obj is { seconds: number; nanoseconds: number } =>
  isObject(obj) &&
  withProp(obj, "seconds", (v): v is number => typeof v === "number") &&
  withProp(obj, "nanoseconds", (v): v is number => typeof v === "number");
