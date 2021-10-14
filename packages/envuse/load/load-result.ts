import { DataSourceParsed } from "../DataSourceParsed";

export interface loadResult {
  dsn: string;
  data: Buffer;
}

export function isLoadResult(data: any): data is loadResult {
  if (typeof data !== "object") {
    return false;
  }
  if (typeof data.dsn !== "string") {
    return false;
  }
  if (!(data.data instanceof Buffer)) {
    return false;
  }
  return true;
}

export function assertLoadResult(data: any): asserts data is loadResult {
  if (typeof data !== "object") {
    throw new Error("loadResult must be an object");
  }
  if (typeof data.dsn !== "string") {
    throw new Error("loadResult.dsn must be a string");
  }
  if (!(data.data instanceof Buffer)) {
    throw new Error("loadResult.data must be a Buffer");
  }
}
