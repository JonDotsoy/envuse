import { ObjectResource } from "../ObjectResource";
import { ValidateObjectResourceError } from "../../errors/validate-object-resource-error";

type Obj = {
  [prop: string | symbol]: unknown;
};

const isObject = (obj: unknown): obj is Obj | null => typeof obj === "object";
const isNull = (obj: unknown): obj is null => obj === null;
const propIsString = <T extends string>(
  obj: Obj,
  prop: T
): obj is typeof obj &
  {
    [k in T]: string;
  } => typeof obj[prop] === "string";

function createValidateObjectResourceError(message: string, meta?: any) {
  const err = new ValidateObjectResourceError(message, meta);
  Error.captureStackTrace(err, validateObjectResource);
  return err;
}

export function validateObjectResource(
  payload: unknown
): asserts payload is ObjectResource {
  if (!isObject(payload))
    throw createValidateObjectResourceError(
      `"payload" is expected to be object`,
      { path: "payload", typeExpected: "object" }
    );
  if (isNull(payload))
    throw createValidateObjectResourceError(
      `"payload" is expected to be object`,
      { path: "payload", typeExpected: "object" }
    );
  if (!propIsString(payload, "id"))
    throw createValidateObjectResourceError(
      `"payload.id" is expected to be string`,
      { path: "payload.id", typeExpected: "string" }
    );
  if (!propIsString(payload, "body"))
    throw createValidateObjectResourceError(
      `"payload.body" is expected to be string`,
      { path: "payload.body", typeExpected: "string" }
    );
  if (!propIsString(payload, "salt"))
    throw createValidateObjectResourceError(
      `"payload.salt" is expected to be string`,
      { path: "payload.salt", typeExpected: "string" }
    );
  if (!propIsString(payload, "contentType"))
    throw createValidateObjectResourceError(
      `"payload.contentType" is expected to be string`,
      { path: "payload.contentType", typeExpected: "string" }
    );
}
