import * as envuse from "envuse-wasm";
import { NodeDocument } from "./types/node";

export const parse = (payload: string): NodeDocument => {
  return envuse.parse(payload);
};
